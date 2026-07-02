import type { LiteraryForm, Marc21EnPrestamo, Marc21ItemType } from '@shared/models'
import { validateISBN } from '@shared/utils'

type MarcField = [string, ...string[]]

type MarcRecord = {
  leader: string
  fields: MarcField[]
}

function getControlField(record: MarcRecord, tag: string): string | undefined {
  for (const field of record.fields) {
    if (field[0] === tag && field.length === 2) return field[1]
  }
  return undefined
}

function getSubfield(field: MarcField, code: string): string | undefined {
  for (let i = 2; i < field.length - 1; i += 2) {
    if (field[i] === code && field[i + 1]) return field[i + 1]
  }
  return undefined
}

function getSubfieldFromRecord(record: MarcRecord, tag: string, code: string): string | undefined {
  for (const field of record.fields) {
    if (field[0] !== tag || field.length < 4) continue
    const val = getSubfield(field, code)
    if (val) return val
  }
  return undefined
}

function getAllFields(record: MarcRecord, tag: string): MarcField[] {
  return record.fields.filter(f => f[0] === tag && f.length >= 4)
}

function parseNumeroInventario(raw: string): string | undefined {
  const trimmed = raw.trim()
  
  /* Extrae prefijo que tiene inserta el Koha */
  const withPrefix = trimmed.match(/Inv\.\s*Interno\s+(\d+)/i)
  if (withPrefix) {
    const digits = withPrefix[1]
    return digits.length <= 5 ? digits : undefined
  }

  const onlyDigits = trimmed.match(/^\d+$/)
  if (onlyDigits) {
    return trimmed.length <= 5 ? trimmed : undefined
  }

  return undefined
}

export type MrcImportError = {
  index: number
  reason: string
}

export type MrcImportResult = {
  libro: Marc21EnPrestamo
  numeroInventario: string
  barcode: string | undefined
}

export type MrcParseResult = {
  validos: MrcImportResult[]
  errores: MrcImportError[]
}

/**
 * Convierte registros MARC21 crudos a `Marc21EnPrestamo`.
 *
 * ## Decisiones de mapeo
 *
 * ### Un registro bibliográfico → N libros (campo 952)
 * En MARC21 el registro bibliográfico describe la obra y cada campo 952
 * representa un ejemplar físico. Un mismo libro puede tener múltiples
 * ejemplares (distintos barcodes, sedes o signaturas). Por eso se genera
 * un `Marc21EnPrestamo` por cada campo 952, todos compartiendo los datos
 * bibliográficos del registro padre (título, autor, año, etc.).
 *
 * ### Número de inventario: 952$x
 * El número de inventario se ingresa manualmente en Koha en el campo
 * "Inventario" (952$x), exportado con el formato "Inv. Interno NNNNN".
 * Se extrae el número del prefijo y se valida que tenga 5 dígitos o menos.
 * Si un ejemplar no tiene 952$x, o el número supera los 5 dígitos, se descarta.
 *
 * ### Código de barras: 952$p (ISBN del ejemplar)
 * El campo 952$p contiene el código de barras, que en esta instancia de Koha corresponde al ISBN.
 * Se valida con el algoritmo del dígito verificador (ISBN-10 módulo 11, ISBN-13 módulo 10 con pesos alternados 1-3).
 * Si no pasa la validación se descarta silenciosamente y el barcode queda vacío.
 *
 * ### Tipo de ítem: 942$c → 952$y → "BK" como fallback
 * El campo estándar para el tipo de material en Koha es 942$c. Sin embargo,
 * las exportaciones antiguas o de otros sistemas suelen omitirlo y poner el
 * tipo en 952$y (a nivel de ejemplar). Si ninguno está presente se asigna
 * "BK" (libro) como valor por defecto para no descartar el registro.
 *
 * ### Puntuación catalográfica
 * MARC21 incluye puntuación al final de subcampos como 245$a (`/`),
 * 100$a (`,`), 260$a (`:`), 260$b (`,`) según las reglas ISBD. Se elimina
 * antes de guardar para no contaminar los datos de la aplicación.
 */
export function parseMrcRecords(records: MarcRecord[]): MrcParseResult {
  const validos: MrcImportResult[] = []
  const errores: MrcImportError[] = []

  records.forEach((record, index) => {
    const titulo = getSubfieldFromRecord(record, '245', 'a')
      ?.replace(/\s*[/]\s*$/, '').trim()

    if (!titulo) {
      errores.push({ index, reason: 'Sin título (245$a)' })
      return
    }

    const field008 = getControlField(record, '008') ?? ''
    const publicationYear = field008.slice(7, 11).trim()
      || getSubfieldFromRecord(record, '260', 'c')?.replace(/\s*[,;.]\s*$/, '').trim()
      || undefined
    const literaryFormRaw = field008[33]
    const literaryForm = literaryFormRaw && literaryFormRaw !== ' '
      ? literaryFormRaw as LiteraryForm
      : undefined

    const itemTypeFromRecord = (getSubfieldFromRecord(record, '942', 'c') ?? '') as Marc21ItemType

    const autor = getSubfieldFromRecord(record, '100', 'a')?.replace(/\s*[,;.]\s*$/, '').trim() || undefined
    const edition = getSubfieldFromRecord(record, '250', 'a')?.replace(/\s*[,;.]\s*$/, '').trim() || undefined
    const placeOfPublication = getSubfieldFromRecord(record, '260', 'a')?.replace(/\s*[:;,]\s*$/, '').trim() || undefined
    const publisher = getSubfieldFromRecord(record, '260', 'b')?.replace(/\s*[:;,]\s*$/, '').trim() || undefined

    const holding952s = getAllFields(record, '952')

    if (holding952s.length === 0) {
      errores.push({ index, reason: `"${titulo}" — Sin ejemplar (952)` })
      return
    }

    holding952s.forEach((field952, holdingIndex) => {
      const barcodeRaw = getSubfield(field952, 'p') || undefined
      const barcode = barcodeRaw && validateISBN(barcodeRaw)
        ? barcodeRaw.replace(/[-\s]/g, '')
        : undefined
      const rawX = getSubfield(field952, 'x')

      if (!rawX) {
        errores.push({ index: index + holdingIndex, reason: `"${titulo}" — Sin número de inventario (952$x)` })
        return
      }

      const numeroInventario = parseNumeroInventario(rawX)
      if (!numeroInventario) {
        errores.push({ index: index + holdingIndex, reason: `"${titulo}" — Número de inventario inválido: "${rawX}"` })
        return
      }

      const homeBranch = getSubfield(field952, 'b')
      if (!homeBranch) {
        errores.push({ index: index + holdingIndex, reason: `"${titulo}" — Sin sede (952$b)` })
        return
      }

      const itemType: Marc21ItemType = itemTypeFromRecord
        || (getSubfield(field952, 'y') as Marc21ItemType | undefined)
        || 'BK'

      const callNumberRaw = getSubfield(field952, 'o')

      const libro: Marc21EnPrestamo = {
        numeroInventario,
        titulo,
        autor,
        authorCountry: undefined,
        itemType,
        literaryForm,
        edition,
        placeOfPublication,
        publisher,
        publicationYear,
        holding: {
          homeBranch,
          holdingBranch: getSubfield(field952, 'a') || homeBranch,
          barcode: barcode ?? '',
          publicNote: getSubfield(field952, 'z') || undefined,
          callNumber: callNumberRaw ? callNumberRaw : undefined,
        },
        nombreSocio: undefined,
        numeroSocio: undefined,
        fechaDePrestamo: null,
      }

      validos.push({ libro, numeroInventario, barcode })
    })
  })

  return { validos, errores }
}
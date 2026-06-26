import fs from 'fs'
import { Iso2709Parser } from 'marcjs'
import { isMarc21 } from '@shared/models'
import type { Marc21EnPrestamo } from '@shared/models/marc21'
import { parseMrcRecords, type MrcImportResult, type MrcImportError } from './mrcToLibro'
import { getLibros, ingresarLibroMark21, editarDatosLibro } from '../handlers/libros'

export type ImportarMrcResult = {
  agregados: number
  actualizados: number
  sinCambios: number
  errores: MrcImportError[]
}

type MarcField = [string, ...string[]]
type MarcRecord = { leader: string; fields: MarcField[] }

function readMrcFile(filePath: string): Promise<MarcRecord[]> {
  return new Promise((resolve, reject) => {
    const records: MarcRecord[] = []
    const parser = new Iso2709Parser()

    parser.on('data', (record: MarcRecord) => records.push(record))
    parser.on('end', () => resolve(records))
    parser.on('error', reject)

    fs.createReadStream(filePath).pipe(parser)
  })
}

function mergeMarc21(
  existente: Marc21EnPrestamo,
  importado: Marc21EnPrestamo
): { merged: Marc21EnPrestamo; changed: boolean } {
  let changed = false

  function fill<T>(existing: T, incoming: T): T {
    if (
      (existing === undefined || existing === null || existing === '') &&
      incoming !== undefined && incoming !== null && incoming !== ''
    ) {
      changed = true
      return incoming
    }
    
    return existing
  }

  const merged: Marc21EnPrestamo = {
    ...existente,
    autor: fill(existente.autor, importado.autor),
    authorCountry: fill(existente.authorCountry, importado.authorCountry),
    literaryForm: fill(existente.literaryForm, importado.literaryForm),
    edition: fill(existente.edition, importado.edition),
    placeOfPublication: fill(existente.placeOfPublication, importado.placeOfPublication),
    publisher: fill(existente.publisher, importado.publisher),
    publicationYear: fill(existente.publicationYear, importado.publicationYear),
    holding: {
      ...existente.holding,
      barcode: fill(existente.holding.barcode, importado.holding.barcode),
      homeBranch: fill(existente.holding.homeBranch, importado.holding.homeBranch),
      holdingBranch: fill(existente.holding.holdingBranch, importado.holding.holdingBranch),
      publicNote: fill(existente.holding.publicNote, importado.holding.publicNote),
      callNumber: fill(existente.holding.callNumber, importado.holding.callNumber),
    },
  }

  return { merged, changed }
}

export async function importarMrc(filePath: string): Promise<ImportarMrcResult> {
  const rawRecords = await readMrcFile(filePath)
  const { validos, errores } = parseMrcRecords(rawRecords)
  const librosExistentes = await getLibros()

  let agregados = 0
  let actualizados = 0
  let sinCambios = 0

  for (const item of validos) {
    const { libro: importado, numeroInventario, barcode } = item as MrcImportResult

    const existente = librosExistentes.find(l => {
      if (numeroInventario && l.numeroInventario && String(l.numeroInventario) === String(numeroInventario)) return true
      if (barcode && isMarc21(l) && l.holding.barcode === barcode) return true
      return false
    })

    if (existente) {
      if (!isMarc21(existente)) {
        errores.push({
          index: -1,
          reason: `El libro con inventario "${numeroInventario ?? barcode}" existe pero no es MARC21`,
        })
        continue
      }

      const { merged, changed } = mergeMarc21(existente, importado)

      if (changed) {
        await editarDatosLibro(existente.numeroInventario as number, merged)
        actualizados++
      }
      else {
        sinCambios++
      }
    }
    else {
      await ingresarLibroMark21(importado)
      agregados++
    }
  }

  return { agregados, actualizados, sinCambios, errores }
}
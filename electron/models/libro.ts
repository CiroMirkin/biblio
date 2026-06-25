import { randomUUID } from "node:crypto"
import type ExcelJS from 'exceljs'
import { isMarc21 } from "@shared/models"
import type { LibroRegistrado, LibroEnPrestamo, CallNumber  } from "@shared/models"
import { type Marc21ItemType, type Marc21LiteraryForm } from "@shared/models/marc21"
import { formatCallNumber } from "@shared/models/callNumber"

export function rowToLibro(row: ExcelJS.Row): LibroRegistrado {
    const libroSimple: LibroEnPrestamo = {
        titulo: String(row.getCell(5).value ?? ''),
        autor: String(row.getCell(4).value ?? '') || undefined,
        numeroInventario: String(row.getCell(6).value ?? ''),
        nombreSocio: String(row.getCell(1).value ?? ''),
        numeroSocio: Number(row.getCell(2).value ?? null),
        fechaDePrestamo: getFechaDePrestamoFromRow(row),
    }

    const itemType = String(row.getCell(7).value ?? '') as Marc21ItemType
    if (!itemType) return libroSimple

    return {
        ...libroSimple,
        itemType,
        authorCountry: String(row.getCell(17) ?? ''),
        literaryForm: (String(row.getCell(8).value ?? '') || undefined) as Marc21LiteraryForm | undefined,
        edition: String(row.getCell(9).value ?? '') || undefined,
        placeOfPublication: String(row.getCell(10).value ?? '') || undefined,
        publisher: String(row.getCell(11).value ?? '') || undefined,
        publicationYear: String(row.getCell(12).value ?? '') || undefined,
        holding: getHoldingFromRow(row),
    }
}

export const getHoldingFromRow = (row: ExcelJS.Row) => ({
    barcode: String(row.getCell(18).value ?? ''),
    homeBranch: String(row.getCell(13).value ?? ''),
    holdingBranch: String(row.getCell(14).value ?? ''),
    publicNote: String(row.getCell(15).value ?? '') || undefined,
    callNumber: parseCallNumber(String(row.getCell(16).value ?? '')) || undefined,
})

export const getFechaDePrestamoFromRow = (row: ExcelJS.Row): Date | null => {
    const rawFecha = row.getCell(3).value
    if (rawFecha instanceof Date) return rawFecha
    if (rawFecha) return new Date(String(rawFecha))
    return null
}

export const getNroDeInventarioFromRow = (row: ExcelJS.Row): string => row.getCell(6).value?.toString() ?? '' 

export function libroToRow(libro: LibroRegistrado): (string | number | Date | null)[] {
    if (isMarc21(libro)) {
        return [
            libro.nombreSocio ?? '',
            libro.numeroSocio ?? null,
            libro.fechaDePrestamo ?? null,
            libro.autor || '',
            libro.titulo,
            libro.numeroInventario ?? '',
            libro.itemType,
            libro.literaryForm ?? '',
            libro.edition ?? '',
            libro.placeOfPublication ?? '',
            libro.publisher ?? '',
            libro.publicationYear ?? '',
            // Holding
            libro.holding.homeBranch,
            libro.holding.holdingBranch,
            libro.holding.publicNote ?? '',
            formatCallNumber(libro.holding.callNumber),
            libro.authorCountry ?? '',
            libro.holding.barcode ?? '',
        ]
    }
 
    return [
        libro.nombreSocio ?? '',
        libro.numeroSocio ?? null,
        libro.fechaDePrestamo ?? null,
        libro.autor || '',
        libro.titulo,
        libro.numeroInventario ?? '',
    ]
}

export function writeLibro(row: ExcelJS.Row, libro: LibroRegistrado): void {
    if (libro.nombreSocio !== undefined) row.getCell(1).value = libro.nombreSocio
    if (libro.numeroSocio !== undefined) row.getCell(2).value = libro.numeroSocio
    if (libro.fechaDePrestamo !== undefined) row.getCell(3).value = libro.fechaDePrestamo

    if (libro.autor !== undefined) row.getCell(4).value = libro.autor
    if (libro.titulo !== undefined) row.getCell(5).value = libro.titulo
    if (libro.numeroInventario !== undefined) row.getCell(6).value = libro.numeroInventario

    if(isMarc21(libro)) {
        if (libro.holding?.barcode !== undefined) row.getCell(18).value = libro.holding.barcode
        if (libro.holding?.homeBranch !== undefined) row.getCell(13).value = libro.holding.homeBranch
        if (libro.holding?.holdingBranch !== undefined) row.getCell(14).value = libro.holding.holdingBranch
        if (libro.holding?.publicNote !== undefined) row.getCell(15).value = libro.holding.publicNote
        if (libro.holding?.callNumber !== undefined) row.getCell(16).value = formatCallNumber(libro.holding.callNumber)

        if (libro.itemType !== undefined) row.getCell(7).value = libro.itemType
        if (libro.literaryForm !== undefined) row.getCell(8).value = libro.literaryForm
        if (libro.edition !== undefined) row.getCell(9).value = libro.edition
        if (libro.placeOfPublication !== undefined) row.getCell(10).value = libro.placeOfPublication
        if (libro.publisher !== undefined) row.getCell(11).value = libro.publisher
        if (libro.publicationYear !== undefined) row.getCell(12).value = libro.publicationYear
        if (libro.authorCountry !== undefined) row.getCell(17).value = libro.authorCountry
    }

    row.commit()
}

export function limpiarPrestamo(row: ExcelJS.Row): void {
    row.getCell(1).value = ''
    row.getCell(2).value = null
    row.getCell(3).value = null
    row.commit()
}

export function esSinInventariar(id: string | number): boolean {
  return id.toString().startsWith('SN-')
}

export function generarIdSinInventariar(): string {
  return `SN-${randomUUID()}`
}

const UMLAUT_MAP: Record<string, string> = {
  'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ü': 'U',
  'À': 'A', 'È': 'E', 'Ì': 'I', 'Ò': 'O', 'Ù': 'U',
  'Â': 'A', 'Ê': 'E', 'Î': 'I', 'Ô': 'O', 'Û': 'U',
  'Ä': 'A', 'Ë': 'E', 'Ï': 'I', 'Ö': 'O',
  'Ñ': 'Ñ',
}

const CUTTER_CHARS = 'A-ZÁÉÍÓÚÜÑÀÈÌÒÙÂÊÎÔÛÄËÏÖ'

const CALL_NUMBER_PATTERN = new RegExp(
  `^[A-Z]{0,4}\\d{3}(\\.\\d+)?\\s[${CUTTER_CHARS}]{2,5}(\\sv\\.\\d+)?$`
)

/** String a Objeto */
export function parseCallNumber(callNumber: string): CallNumber | null {
  const forValidation = normalizeCallNumber(callNumber)
  const match = forValidation.match(
    new RegExp(`^([A-Z]{1,4})?(\\d{3}(?:\\.\\d+)?)\\s([${CUTTER_CHARS}]{2,5})(?:\\s(v\\.\\d+))?$`)
  )
  if (!match) return null

  const originalCutter = callNumber
    .trim()
    .toUpperCase()
    .replace(/^([A-Z]{1,4})\s(\d)/, '$1$2')
    .replace(/\s+/g, ' ')
    .match(new RegExp(`^[A-Z]{0,4}\\d{3}(?:\\.\\d+)?\\s([${CUTTER_CHARS}]{2,5})`))

  return {
    prefix: match[1],
    dewey: match[2],
    cutter: originalCutter?.[1] ?? match[3],
    volume: match[4],
  }
}

export function isValidCallNumber(callNumber: string): boolean {
  return CALL_NUMBER_PATTERN.test(normalizeCallNumber(callNumber))
}

export function normalizeCallNumber(callNumber: string): string {
  return callNumber
    .trim()
    .toUpperCase()
    .replace(/^([A-Z]{1,4})\s(\d)/, '$1$2')
    .replace(/\s+/g, ' ')
    .replace(/[ÁÉÍÓÚÜÀÈÌÒÙÂÊÎÔÛÄËÏÖ]/g, c => UMLAUT_MAP[c] ?? c)
    .replace(/V\.(\d+)/, 'v.$1')
}

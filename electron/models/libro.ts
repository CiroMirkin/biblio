import { randomUUID } from "node:crypto"
import type ExcelJS from 'exceljs'
import type { Libro, LiteraryForm, Marc21ItemType  } from "@shared/models"

export const COLUMNAS_LIBRO = {
    nombreSocio: 1,
    numeroSocio: 2,
    fechaDePrestamo: 3,
    autor: 4,
    titulo: 5,
    numeroInventario: 6,
    itemType: 7,
    literaryForm: 8,
    edition: 9,
    placeOfPublication: 10,
    publisher: 11,
    publicationYear: 12,
    homeBranch: 13,
    holdingBranch: 14,
    publicNote: 15,
    callNumber: 16,
    authorCountry: 17,
    barcode: 18,
    dewey: 19,
    fechaDeIngreso: 20,
    literaryGenres: 21,
} as const

export const celdaLibro = (row: ExcelJS.Row, campo: keyof typeof COLUMNAS_LIBRO) =>
    row.getCell(COLUMNAS_LIBRO[campo])

export function rowToLibro(row: ExcelJS.Row): Libro {
    return {
        titulo: String(celdaLibro(row, 'titulo').value ?? ''),
        autor: String(celdaLibro(row, 'autor').value ?? '') || undefined,
        numeroInventario: String(celdaLibro(row, 'numeroInventario').value ?? ''),
        literaryForm: (String(celdaLibro(row, 'literaryForm').value ?? '') || undefined) as LiteraryForm | undefined,
        fechaDeIngreso: getFechaDeIngresoFromRow(row),
        literaryGenres: String(celdaLibro(row, 'literaryGenres') ?? ''),
        itemType: (String(celdaLibro(row, 'itemType').value ?? '') || undefined) as Marc21ItemType | undefined,
        authorCountry: String(celdaLibro(row, 'authorCountry') ?? ''),
        edition: String(celdaLibro(row, 'edition').value ?? '') || undefined,
        placeOfPublication: String(celdaLibro(row, 'placeOfPublication').value ?? '') || undefined,
        publisher: String(celdaLibro(row, 'publisher').value ?? '') || undefined,
        publicationYear: String(celdaLibro(row, 'publicationYear').value ?? '') || undefined,
        holding: getHoldingFromRow(row),
        dewey: (() => {
            const raw = celdaLibro(row, 'dewey').value
            const parsed = typeof raw === 'number' ? raw : parseFloat(String(raw ?? ''))
            return isNaN(parsed) ? undefined : parsed
        })(),
    }
}

export const getHoldingFromRow = (row: ExcelJS.Row) => ({
    barcode: String(celdaLibro(row, 'barcode').value ?? ''),
    homeBranch: String(celdaLibro(row, 'homeBranch').value ?? ''),
    holdingBranch: String(celdaLibro(row, 'holdingBranch').value ?? ''),
    publicNote: String(celdaLibro(row, 'publicNote').value ?? '') || undefined,
    callNumber: String(celdaLibro(row, 'callNumber').value ?? '') || undefined,
})

export const getFechaDePrestamoFromRow = (row: ExcelJS.Row): Date | null => {
    const rawFecha = celdaLibro(row, 'fechaDePrestamo').value
    if (rawFecha instanceof Date) return rawFecha
    if (rawFecha) return new Date(String(rawFecha))
    return null
}

export const getFechaDeIngresoFromRow = (row: ExcelJS.Row): Date | null => {
    const rawFecha = celdaLibro(row, 'fechaDeIngreso').value
    if (rawFecha instanceof Date) return rawFecha
    if (rawFecha) return new Date(String(rawFecha))
    return null
}

export const getNroDeInventarioFromRow = (row: ExcelJS.Row): string => celdaLibro(row, 'numeroInventario').value?.toString() ?? '' 

export function writeLibro(row: ExcelJS.Row, libro: Libro): void {
    if (libro.fechaDeIngreso !== undefined && libro.fechaDeIngreso !== null) {
        celdaLibro(row, 'fechaDeIngreso').value = libro.fechaDeIngreso
    }

    if (libro.autor !== undefined) celdaLibro(row, 'autor').value = libro.autor
    if (libro.titulo !== undefined) celdaLibro(row, 'titulo').value = libro.titulo
    if (libro.numeroInventario !== undefined) celdaLibro(row, 'numeroInventario').value = libro.numeroInventario
    if (libro.literaryForm !== undefined) celdaLibro(row, 'literaryForm').value = libro.literaryForm
    if (libro.literaryGenres !== undefined) celdaLibro(row, 'literaryGenres').value = String(libro.literaryGenres || '')

    if (libro.holding?.homeBranch !== undefined) celdaLibro(row, 'homeBranch').value = libro.holding.homeBranch
    if (libro.holding?.holdingBranch !== undefined) celdaLibro(row, 'holdingBranch').value = libro.holding.holdingBranch
    if (libro.holding?.publicNote !== undefined) celdaLibro(row, 'publicNote').value = libro.holding.publicNote
    if (libro.holding?.callNumber !== undefined) celdaLibro(row, 'callNumber').value = libro.holding.callNumber
    
    if (libro.itemType !== undefined) celdaLibro(row, 'itemType').value = libro.itemType
    if (libro.edition !== undefined) celdaLibro(row, 'edition').value = libro.edition
    if (libro.placeOfPublication !== undefined) celdaLibro(row, 'placeOfPublication').value = libro.placeOfPublication
    if (libro.publisher !== undefined) celdaLibro(row, 'publisher').value = libro.publisher
    if (libro.publicationYear !== undefined) celdaLibro(row, 'publicationYear').value = libro.publicationYear
    if (libro.authorCountry !== undefined) celdaLibro(row, 'authorCountry').value = libro.authorCountry
    if (libro.holding?.barcode !== undefined) celdaLibro(row, 'barcode').value = libro.holding.barcode
    celdaLibro(row, 'dewey').value = libro.dewey === undefined ? '' : String(libro.dewey)

    row.commit()
}

// las columnas de préstamo siguen en libros.xlsx solo para no correr el resto, se vacían al migrar a prestamos.xlsx
export function limpiarPrestamo(row: ExcelJS.Row): void {
    celdaLibro(row, 'nombreSocio').value = ''
    celdaLibro(row, 'numeroSocio').value = null
    celdaLibro(row, 'fechaDePrestamo').value = null
    row.commit()
}

export function esSinInventariar(id: string | number): boolean {
  return id.toString().startsWith('SN-')
}

export function generarIdSinInventariar(): string {
  return `SN-${randomUUID()}`
}

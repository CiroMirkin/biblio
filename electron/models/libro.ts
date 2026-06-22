import { randomUUID } from "node:crypto"
import type ExcelJS from 'exceljs'
import { isMarc21, type Marc21, type Marc21EnPrestamo, type Marc21LiteraryForm } from "./marc21"
import type { DatosPrestamo } from "./prestamo"

export interface Libro {
    titulo: string
    autor?: string
    numeroInventario?: number | string
}

export type LibroEnPrestamo = Libro & DatosPrestamo

export type LibroRegistrado = LibroEnPrestamo | Marc21EnPrestamo

export function rowToLibro(row: ExcelJS.Row): LibroRegistrado {
    return {
        nombreSocio: String(row.getCell(1).value ?? ''),
        numeroSocio: Number(row.getCell(2).value ?? null),
        fechaDePrestamo: getFechaDePrestamoFromRow(row),
        autor: String(row.getCell(4).value ?? ''),
        titulo: String(row.getCell(5).value ?? ''),
        numeroInventario: String(row.getCell(6).value ?? ''),
        itemType: String(row.getCell(7).value ?? '') as Marc21["itemType"],
        literaryForm: (String(row.getCell(8).value ?? '') || undefined) as Marc21LiteraryForm | undefined,
        edition: String(row.getCell(9).value ?? '') || undefined,
        placeOfPublication: String(row.getCell(10).value ?? '') || undefined,
        publisher: String(row.getCell(11).value ?? '') || undefined,
        publicationYear: String(row.getCell(12).value ?? '') || undefined,
        holding: getHoldingFromRow(row),
    }
}

export const getHoldingFromRow = (row: ExcelJS.Row) => ({
    barcode: String(row.getCell(6).value ?? ''),
    homeBranch: String(row.getCell(13).value ?? ''),
    holdingBranch: String(row.getCell(14).value ?? ''),
    shelvingLocation: String(row.getCell(15).value ?? '') || undefined,
    callNumber: String(row.getCell(16).value ?? '') || undefined,
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
            libro.holding.homeBranch,
            libro.holding.holdingBranch,
            libro.holding.shelvingLocation ?? '',
            libro.holding.callNumber ?? '',
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

export function writeLibro(row: ExcelJS.Row, libro: LibroRegistrado | Libro): void {
    if("nombreSocio" in libro) { 
        if (libro.nombreSocio !== undefined) row.getCell(1).value = libro.nombreSocio
    }

    if("numeroSocio" in libro) {
        if (libro.numeroSocio !== undefined) row.getCell(2).value = libro.numeroSocio
    }
    
    if("fechaDePrestamo" in libro) {
        if (libro.fechaDePrestamo !== undefined) row.getCell(3).value = libro.fechaDePrestamo
    }

    if (libro.autor !== undefined) row.getCell(4).value = libro.autor
    if (libro.titulo !== undefined) row.getCell(5).value = libro.titulo
    if("numeroInventario" in libro) {
        if (libro.numeroInventario !== undefined) row.getCell(6).value = libro.numeroInventario
    }

    if(isMarc21(libro)) {
        if (libro.holding?.barcode !== undefined) row.getCell(6).value = libro.holding.barcode
        if (libro.holding?.homeBranch !== undefined) row.getCell(13).value = libro.holding.homeBranch
        if (libro.holding?.holdingBranch !== undefined) row.getCell(14).value = libro.holding.holdingBranch
        if (libro.holding?.shelvingLocation !== undefined) row.getCell(15).value = libro.holding.shelvingLocation
        if (libro.holding?.callNumber !== undefined) row.getCell(16).value = libro.holding.callNumber
    }

    if("itemType" in libro) if (libro.itemType !== undefined) row.getCell(7).value = libro.itemType
    if("literaryForm" in libro) if (libro.literaryForm !== undefined) row.getCell(8).value = libro.literaryForm
    if("edition" in libro) if (libro.edition !== undefined) row.getCell(9).value = libro.edition
    if("placeOfPublication" in libro) if (libro.placeOfPublication !== undefined) row.getCell(10).value = libro.placeOfPublication
    if("publisher" in libro) if (libro.publisher !== undefined) row.getCell(11).value = libro.publisher
    if("publicationYear" in libro) if (libro.publicationYear !== undefined) row.getCell(12).value = libro.publicationYear

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


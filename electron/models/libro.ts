import { randomUUID } from "node:crypto"
import type ExcelJS from 'exceljs'
import { isMarc21 } from "@shared/models"
import type { LibroRegistrado, LibroEnPrestamo, LiteraryForm, Marc21ItemType  } from "@shared/models"

export function rowToLibro(row: ExcelJS.Row): LibroRegistrado {
    const libroSimple: LibroEnPrestamo = {
        titulo: String(row.getCell(5).value ?? ''),
        autor: String(row.getCell(4).value ?? '') || undefined,
        numeroInventario: String(row.getCell(6).value ?? ''),
        nombreSocio: String(row.getCell(1).value ?? ''),
        numeroSocio: Number(row.getCell(2).value ?? null),
        fechaDePrestamo: getFechaDePrestamoFromRow(row),
        literaryForm: (String(row.getCell(8).value ?? '') || undefined) as LiteraryForm | undefined,
    }

    const itemType = String(row.getCell(7).value ?? '') as Marc21ItemType
    if (!itemType) return libroSimple

    return {
        ...libroSimple,
        itemType,
        authorCountry: String(row.getCell(17) ?? ''),
        edition: String(row.getCell(9).value ?? '') || undefined,
        placeOfPublication: String(row.getCell(10).value ?? '') || undefined,
        publisher: String(row.getCell(11).value ?? '') || undefined,
        publicationYear: String(row.getCell(12).value ?? '') || undefined,
        holding: getHoldingFromRow(row),
        dewey: (() => {
            const raw = row.getCell(19).value
            const parsed = typeof raw === 'number' ? raw : parseFloat(String(raw ?? ''))
            return isNaN(parsed) ? undefined : parsed
        })(),
    }
}

export const getHoldingFromRow = (row: ExcelJS.Row) => ({
    barcode: String(row.getCell(18).value ?? ''),
    homeBranch: String(row.getCell(13).value ?? ''),
    holdingBranch: String(row.getCell(14).value ?? ''),
    publicNote: String(row.getCell(15).value ?? '') || undefined,
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
            // Holding
            libro.holding.homeBranch,
            libro.holding.holdingBranch,
            libro.holding.publicNote ?? '',
            libro.holding.callNumber ?? '',
            libro.authorCountry ?? '',
            libro.holding.barcode ?? '',
            libro.dewey ?? '',
        ]
    }
 
    return [
        libro.nombreSocio ?? '',
        libro.numeroSocio ?? null,
        libro.fechaDePrestamo ?? null,
        libro.autor || '',
        libro.titulo,
        libro.numeroInventario ?? '',
        '', // Pertenece a itemType el cual no existe en Libro
        libro.literaryForm ?? '',
    ]
}

export function writeLibro(row: ExcelJS.Row, libro: LibroRegistrado): void {
    if (libro.nombreSocio !== undefined) row.getCell(1).value = libro.nombreSocio
    if (libro.numeroSocio !== undefined) row.getCell(2).value = libro.numeroSocio
    if (libro.fechaDePrestamo !== undefined) row.getCell(3).value = libro.fechaDePrestamo

    if (libro.autor !== undefined) row.getCell(4).value = libro.autor
    if (libro.titulo !== undefined) row.getCell(5).value = libro.titulo
    if (libro.numeroInventario !== undefined) row.getCell(6).value = libro.numeroInventario
    if (libro.literaryForm !== undefined) row.getCell(8).value = libro.literaryForm

    if(isMarc21(libro)) {
        if (libro.holding?.homeBranch !== undefined) row.getCell(13).value = libro.holding.homeBranch
        if (libro.holding?.holdingBranch !== undefined) row.getCell(14).value = libro.holding.holdingBranch
        if (libro.holding?.publicNote !== undefined) row.getCell(15).value = libro.holding.publicNote
        if (libro.holding?.callNumber !== undefined) row.getCell(16).value = libro.holding.callNumber
        
        if (libro.itemType !== undefined) row.getCell(7).value = libro.itemType
        if (libro.edition !== undefined) row.getCell(9).value = libro.edition
        if (libro.placeOfPublication !== undefined) row.getCell(10).value = libro.placeOfPublication
        if (libro.publisher !== undefined) row.getCell(11).value = libro.publisher
        if (libro.publicationYear !== undefined) row.getCell(12).value = libro.publicationYear
        if (libro.authorCountry !== undefined) row.getCell(17).value = libro.authorCountry
        if (libro.holding?.barcode !== undefined) row.getCell(18).value = libro.holding.barcode
        if (libro.dewey !== undefined) row.getCell(19).value = String(libro.dewey)
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


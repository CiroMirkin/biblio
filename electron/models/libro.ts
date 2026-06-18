import { randomUUID } from "node:crypto"
import type ExcelJS from 'exceljs'

export interface Libro {
    titulo: string
    autor?: string
    numeroInventario?: number | string
    nombreSocio?: string
    numeroSocio?: number | null
}

export interface LibroEnPrestamo extends Libro {
    fechaDePrestamo: Date | null
}

export function rowToLibro(row: ExcelJS.Row): LibroEnPrestamo {
    return {
        nombreSocio: String(row.getCell(1).value ?? ''),
        numeroSocio: Number(row.getCell(2).value ?? null),
        fechaDePrestamo: getFechaDePrestamoFromRow(row),
        autor: String(row.getCell(4).value),
        titulo: String(row.getCell(5).value ?? ''),
        numeroInventario: String(row.getCell(6).value ?? ''),
    }
}

export const getFechaDePrestamoFromRow = (row: ExcelJS.Row): Date | null => {
    const rawFecha = row.getCell(3).value
    if (rawFecha instanceof Date) return rawFecha
    if (rawFecha) return new Date(String(rawFecha))
    return null
}

export const getNroDeInventarioFromRow = (row: ExcelJS.Row): string => row.getCell(6).value?.toString() ?? '' 


export function libroToRow(libro: LibroEnPrestamo): (string | number | Date | null)[] {
    return [
        libro.nombreSocio ?? '',
        libro.numeroSocio ?? null,
        libro.fechaDePrestamo ?? null,
        libro.autor || '',
        libro.titulo,
        libro.numeroInventario ?? '',
    ]
}

export function writeLibro(row: ExcelJS.Row, libro: LibroEnPrestamo): void {
    if (libro.nombreSocio !== undefined) row.getCell(1).value = libro.nombreSocio
    if (libro.numeroSocio !== undefined) row.getCell(2).value = libro.numeroSocio
    if (libro.fechaDePrestamo !== undefined) row.getCell(3).value = libro.fechaDePrestamo
    if (libro.autor !== undefined) row.getCell(4).value = libro.autor
    if (libro.titulo !== undefined) row.getCell(5).value = libro.titulo
    if (libro.numeroInventario !== undefined) row.getCell(6).value = libro.numeroInventario
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


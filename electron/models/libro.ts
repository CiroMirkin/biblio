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
    const rawFecha = row.getCell(6).value
    const fechaDePrestamo = rawFecha instanceof Date
        ? rawFecha
        : rawFecha
            ? new Date(String(rawFecha))
            : null

    const numeroInventario = String(row.getCell(3).value ?? '')

    return {
        autor: String(row.getCell(1).value),
        titulo: String(row.getCell(2).value ?? ''),
        numeroInventario: numeroInventario,
        nombreSocio: String(row.getCell(4).value ?? ''),
        numeroSocio: Number(row.getCell(5).value ?? null),
        fechaDePrestamo,
    }
}

export function esSinInventariar(id: string | number): boolean {
  return id.toString().startsWith('SN-')
}

export function generarIdSinInventariar(): string {
  return `SN-${randomUUID()}`
}


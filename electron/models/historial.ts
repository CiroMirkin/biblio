import type { HistorialEntry } from '@shared/models'
import type ExcelJS from 'exceljs'

export const COLUMNAS_HISTORIAL = {
  idPrestamo: 1,
  fechaPrestamo: 2,
  fechaDevolucion: 3,
  nroSocio: 4,
  nroLibro: 5,
} as const

export const celdaHistorial = (row: ExcelJS.Row, campo: keyof typeof COLUMNAS_HISTORIAL) =>
  row.getCell(COLUMNAS_HISTORIAL[campo])

function parseFecha(value: ExcelJS.CellValue): Date | null {
  const fecha = value instanceof Date ? value : new Date(String(value ?? ''))
  return isNaN(fecha.getTime()) ? null : fecha
}

export function rowToHistorialEntry(row: ExcelJS.Row): HistorialEntry | null {
  const fechaPrestamo = parseFecha(celdaHistorial(row, 'fechaPrestamo').value)
  if (!fechaPrestamo) return null

  const fechaDevolucionValue = celdaHistorial(row, 'fechaDevolucion').value
  const fechaDevolucion = fechaDevolucionValue ? parseFecha(fechaDevolucionValue) : null

  return {
    idPrestamo: String(celdaHistorial(row, 'idPrestamo').value ?? ''),
    fechaPrestamo,
    fechaDevolucion,
    nroSocio: Number(celdaHistorial(row, 'nroSocio').value) || 0,
    nroLibro: String(celdaHistorial(row, 'nroLibro').value ?? ''),
  }
}

export function writeHistorialEntry(row: ExcelJS.Row, entry: HistorialEntry): void {
  celdaHistorial(row, 'idPrestamo').value = entry.idPrestamo
  celdaHistorial(row, 'fechaPrestamo').value = entry.fechaPrestamo
  celdaHistorial(row, 'fechaDevolucion').value = entry.fechaDevolucion
  celdaHistorial(row, 'nroSocio').value = entry.nroSocio
  celdaHistorial(row, 'nroLibro').value = entry.nroLibro
}

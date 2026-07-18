import type ExcelJS from 'exceljs'

export interface HistorialEntry {
  idPrestamo: string
  fechaPrestamo: Date
  fechaDevolucion: Date | null
  nroSocio: number
  nroLibro: string
}

function parseFecha(value: ExcelJS.CellValue): Date | null {
  const fecha = value instanceof Date ? value : new Date(String(value ?? ''))
  return isNaN(fecha.getTime()) ? null : fecha
}

export function rowToHistorialEntry(row: ExcelJS.Row): HistorialEntry | null {
  const fechaPrestamo = parseFecha(row.getCell(2).value)
  if (!fechaPrestamo) return null

  const fechaDevolucionValue = row.getCell(3).value
  const fechaDevolucion = fechaDevolucionValue ? parseFecha(fechaDevolucionValue) : null

  return {
    idPrestamo: String(row.getCell(1).value ?? ''),
    fechaPrestamo,
    fechaDevolucion,
    nroSocio: Number(row.getCell(4).value) || 0,
    nroLibro: String(row.getCell(5).value ?? ''),
  }
}

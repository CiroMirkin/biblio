import type ExcelJS from 'exceljs'

export function parseFecha(value: ExcelJS.CellValue): string | null {
  if (value instanceof Date) {
    const d = value as Date
    return isNaN(d.getTime()) ? null : d.toISOString()
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d.toISOString()
  }
  return null
}

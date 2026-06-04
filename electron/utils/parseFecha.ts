import type ExcelJS from 'exceljs'

export function parseFecha(value1: ExcelJS.CellValue, value2: ExcelJS.CellValue): [string, string] {
  const raw1 = value1 instanceof Date ? value1.toISOString().split('T')[0] : String(value1 ?? '')
  const raw2 = value2 instanceof Date ? value2.toISOString().split('T')[0] : String(value2 ?? '')

  const fixAnio = (fecha: string) => fecha.replace(/^(\d{2,3})-/, (_, y) => `${y.padStart(4, '2')}-`)

  if (raw1.includes('-') && !raw2) {
    const [f1, f2] = raw1.split('-').map(f => fixAnio(f.trim()))
    return [f1 ?? '', f2 ?? '']
  }

  return [fixAnio(raw1), fixAnio(raw2)]
}
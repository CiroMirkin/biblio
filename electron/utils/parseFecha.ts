import type ExcelJS from 'exceljs'

export function parseFecha(value1: ExcelJS.CellValue, value2: ExcelJS.CellValue): [string, string] {
  const toRaw = (value: ExcelJS.CellValue): string => {
    if (!value) return ''
    
    if (value instanceof Date) return value.toLocaleDateString('es-AR')
    if (typeof value === 'object' && 'text' in value) return ''

    return String(value)
  }
  
  const raw1 = toRaw(value1)
  const raw2 = toRaw(value2)
  if (raw1.includes('-') && !raw2) {
      const [f1, f2] = raw1.split('-')
      return [f1?.trim() ?? '', f2?.trim() ?? '']
  }

  return [raw1, raw2]
}
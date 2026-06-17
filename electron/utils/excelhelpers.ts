import ExcelJS from 'exceljs'

export function getCellString(cell: ExcelJS.Cell): string {
  const val = cell.value
  if (!val) return ''
  
  if (typeof val === 'object' && 'text' in val) {
    return String((val as { text: unknown }).text ?? '')
  }
  if (typeof val === 'object' && 'result' in val) {
    return String((val as { result: unknown }).result ?? '')
  }
  return String(val)
}

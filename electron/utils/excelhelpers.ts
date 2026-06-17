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

export function migrarFaltaDeTextoEnCuota(cell: ExcelJS.Cell): void {
  if (cell.value === 'pago' || cell.value === 'adeuda') return
  if (cell.value === null || String(cell.value).trim() === '') {
    cell.value = 'adeuda'
  }
}

export function toggleCeldaPago(cell: ExcelJS.Cell): boolean {
  if (cell.value === 'pago') {
    cell.value = 'adeuda'
    return false
  }
  cell.value = 'pago'
  return true
}

export function construirIndiceMeses(headerRow: ExcelJS.Row): Map<number, { anio: number; mes: number }> {
  const indice = new Map<number, { anio: number; mes: number }>()

  headerRow.eachCell({ includeEmpty: false }, (cell, colIndex) => {
    if (!(cell.value instanceof Date)) return
    const fecha = cell.value as Date
    indice.set(colIndex, {
      anio: fecha.getUTCFullYear(),
      mes: fecha.getUTCMonth(),
    })
  })

  return indice
}
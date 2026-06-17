import type ExcelJS from 'exceljs'

export type Cuota = Record<string, boolean>
export type CalendarioDeCuotas = Cuota[]

export type HistorialDeCuotas = Map< number, { anio: number; mes: number} >

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

export function construirIndiceMeses(headerRow: ExcelJS.Row): HistorialDeCuotas  {
  const indice = new Map<number, { anio: number; mes: number} >()

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

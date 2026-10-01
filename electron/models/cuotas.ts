import type ExcelJS from 'exceljs'
import { ANIOS_DE_CUOTAS_CONSERVADOS } from '../utils/datosExcel'

export type Cuota = Record<string, boolean>
export type CalendarioDeCuotas = Cuota[]

export type HistorialDeCuotas = Map< number, { anio: number; mes: number} >

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

// Cada año nuevo va a la derecha precedido de una columna separadora vacía y se borra el más viejo (con su separador) para que el archivo nunca tenga más de ANIOS_DE_CUOTAS_CONSERVADOS años.
// Solo agrega años posteriores al último, un año faltante anterior sigue sin existir.
export function asegurarAnio(worksheet: ExcelJS.Worksheet, anio: number) {
  const headerRow = worksheet.getRow(1)
  const columnasDe = (a: number) => [...construirIndiceMeses(headerRow)]
    .filter(([, m]) => m.anio === a)
    .map(([col]) => col)

  const anios = () => [...new Set([...construirIndiceMeses(headerRow).values()].map(m => m.anio))]
    .sort((a, b) => a - b)

  if (anios().length === 0) return

  for (let nuevo = Math.max(...anios()) + 1; nuevo <= anio; nuevo++) {
    while (anios().length >= ANIOS_DE_CUOTAS_CONSERVADOS) {
      const columnas = columnasDe(anios()[0]).sort((a, b) => b - a)
      if (!headerRow.getCell(columnas[0] + 1).value) {
        worksheet.spliceColumns(columnas[0] + 1, 1)
      }
      for (const col of columnas) worksheet.spliceColumns(col, 1)
    }

    const ultima = Math.max(...construirIndiceMeses(headerRow).keys())
    const estilo = headerRow.getCell(ultima).style
    worksheet.spliceColumns(ultima + 1, 0, ...Array.from({ length: 13 }, () => []))

    for (let mes = 0; mes < 12; mes++) {
      const cell = headerRow.getCell(ultima + 2 + mes)
      cell.value = new Date(Date.UTC(nuevo, mes, 1))
      cell.style = { ...estilo }
    }
  }
}

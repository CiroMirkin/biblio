import ExcelJS from 'exceljs'
import { parseFecha } from './parseFecha'
import type { Socio } from '../socio'

export function rowToSocio(row: ExcelJS.Row): Socio {
  const telefonoRaw = row.getCell(9).value
  const telefono = telefonoRaw && telefonoRaw !== 0 ? String(telefonoRaw) : null

  return {
    nroSocio: Number(row.getCell(2).value) || 0,
    nombreYApellido: String(row.getCell(3).value ?? ''),
    domicilio: String(row.getCell(4).value ?? ''),
    dni: Number(row.getCell(5).value) || 0,
    nacionalidad: String(row.getCell(6).value ?? ''),
    fechaNacimiento: parseFecha(row.getCell(7).value),
    caracterSocio: String(row.getCell(10).value ?? ''),
    fechaIngresoEgreso: parseFecha(row.getCell(11).value),
    observaciones: String(row.getCell(12).value ?? ''),
    telefono,
  }
}

export function celdaEstaPintada(cell: ExcelJS.Cell): boolean {
  const fill = cell.fill
  if (!fill || fill.type !== 'pattern') return false
  const pattern = fill as ExcelJS.FillPattern
  return pattern.pattern !== 'none'
}

export function migrarCeldaPintadaAPago(cell: ExcelJS.Cell): void {
  if (cell.value === 'pago') return
  if (celdaEstaPintada(cell)) {
    cell.value = 'pago'
  }
}

export function toggleCeldaPago(cell: ExcelJS.Cell): boolean {
  if (cell.value === 'pago') {
    cell.value = ''
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
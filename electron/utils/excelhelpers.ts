import ExcelJS from 'exceljs'
import { parseFecha } from './parseFecha'
import type { Socio } from '../socio'
import type { LibroEnPrestamo } from '../libro'

export function rowToSocio(row: ExcelJS.Row): Socio {
  const telefonoRaw = row.getCell(6).value
  const telefono = telefonoRaw && telefonoRaw !== 0 ? String(telefonoRaw) : null

  const [ fechaIngreso, fechaEgreso ] = parseFecha(row.getCell(8).value, row.getCell(9).value)

  const nroSocio = Number(row.getCell(1).value) || 0
  return {
    nroSocio,
    nombreYApellido: String(row.getCell(2).value ?? ''),
    domicilio: String(row.getCell(3).value ?? ''),
    dni: Number(row.getCell(4).value) || 0,
    fechaNacimiento: String(row.getCell(5).value ?? ''),
    telefono,
    caracterSocio: String(row.getCell(7).value ?? ''),
    fechaIngreso,
    fechaEgreso,
    observaciones: String(row.getCell(10).value ?? ''),
    email: String(row.getCell(11).value ?? ''),
  }
}

export function writeSocio(row: ExcelJS.Row, socio: Socio): void {
  row.getCell(2).value = socio.nombreYApellido ?? ""
  row.getCell(3).value = socio.domicilio ?? ""
  row.getCell(4).value = socio.dni ?? ""
  row.getCell(5).value = socio.fechaNacimiento ? String(socio.fechaNacimiento) : ""
  row.getCell(6).value = socio.telefono ?? ""
  row.getCell(7).value = socio.caracterSocio ?? ""
  row.getCell(8).value = socio.fechaIngreso ? String(socio.fechaIngreso) : ""
  row.getCell(9).value = socio.fechaEgreso ? String(socio.fechaEgreso) : ""
  row.getCell(10).value = socio.observaciones ?? ""
  row.getCell(11).value = socio.email ?? ""
}

export function rowToLibro(row: ExcelJS.Row): LibroEnPrestamo {
  const rawFecha = row.getCell(6).value
  const fechaDePrestamo = rawFecha instanceof Date
    ? rawFecha
    : rawFecha
      ? new Date(String(rawFecha))
      : null

  const numeroInventario = String(row.getCell(3).value ?? '')

  return {
    autor: String(row.getCell(1).value),
    titulo: String(row.getCell(2).value ?? ''),
    numeroInventario: numeroInventario,
    nombreSocio: String(row.getCell(4).value ?? ''),
    numeroSocio: Number(row.getCell(5).value ?? null),
    fechaDePrestamo,
  }
}

export function celdaEstaPintada(cell: ExcelJS.Cell): boolean {
  const fill = cell.fill
  if (!fill || fill.type !== 'pattern') return false
  const pattern = fill as ExcelJS.FillPattern
  return pattern.pattern !== 'none'
}

export function migrarCeldaPintadaAPago(cell: ExcelJS.Cell): void {
  if (cell.value === 'pago' || cell.value === 'adeuda') return
  if (celdaEstaPintada(cell)) {
    cell.value = 'pago'
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
import ExcelJS from 'exceljs'
import { parseFecha } from './parseFecha'
import type { Socio } from '../socio'

export function rowToSocio(row: ExcelJS.Row): Socio {
  const telefonoRaw = row.getCell(5).value
  const telefono =
    telefonoRaw && telefonoRaw !== 0 ? String(telefonoRaw) : null

  return {
    nroSocio: Number(row.getCell(1).value) || 0,
    nombreYApellido: String(row.getCell(2).value ?? ''),
    domicilio: String(row.getCell(3).value ?? ''),
    dni: Number(row.getCell(4).value) || 0,
    telefono,
    nacionalidad: String(row.getCell(6).value ?? ''),
    fechaNacimiento: parseFecha(row.getCell(7).value),
    caracterSocio: String(row.getCell(8).value ?? ''),
    fechaIngresoEgreso: parseFecha(row.getCell(9).value),
    observaciones: String(row.getCell(10).value ?? ''),
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
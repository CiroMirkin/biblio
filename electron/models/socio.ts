import type ExcelJS from 'exceljs'
import { getCellString } from '../utils/excelhelpers'
import { parseFecha } from '../utils/parseFecha'
import type { Socio, NroSocio } from '@shared/models/socio'

export const COLUMNAS_SOCIO = {
  nroSocio: 1,
  nombreYApellido: 2,
  domicilio: 3,
  dni: 4,
  fechaNacimiento: 5,
  telefono: 6,
  caracterSocio: 7,
  fechaIngreso: 8,
  fechaEgreso: 9,
  observaciones: 10,
  email: 11,
  sociosVinculados: 12,
} as const

export const celdaSocio = (row: ExcelJS.Row, campo: keyof typeof COLUMNAS_SOCIO) =>
  row.getCell(COLUMNAS_SOCIO[campo])

export function writeSocio(row: ExcelJS.Row, socio: Socio): void {
  celdaSocio(row, 'nombreYApellido').value = socio.nombreYApellido ?? ""
  celdaSocio(row, 'domicilio').value = socio.domicilio ?? ""
  celdaSocio(row, 'dni').value = socio.dni ?? ""
  celdaSocio(row, 'fechaNacimiento').value = socio.fechaNacimiento ? String(socio.fechaNacimiento) : ""
  celdaSocio(row, 'telefono').value = socio.telefono ?? ""
  celdaSocio(row, 'caracterSocio').value = socio.caracterSocio ?? ""
  celdaSocio(row, 'fechaIngreso').value = socio.fechaIngreso ? String(socio.fechaIngreso) : ""
  celdaSocio(row, 'fechaEgreso').value = socio.fechaEgreso ? String(socio.fechaEgreso) : ""
  celdaSocio(row, 'observaciones').value = String(socio.observaciones ?? "")
  celdaSocio(row, 'email').value = String(socio.email ?? "")
  celdaSocio(row, 'sociosVinculados').value = formatSociosVinculado(socio.sociosVinculados)
}

export function rowToSocio(row: ExcelJS.Row): Socio {
  const telefonoRaw = celdaSocio(row, 'telefono').value
  const telefono = telefonoRaw && telefonoRaw !== 0 ? String(telefonoRaw) : null

  const [fechaIngreso, fechaEgreso] = parseFecha(celdaSocio(row, 'fechaIngreso').value, celdaSocio(row, 'fechaEgreso').value)

  const nroSocio = Number(celdaSocio(row, 'nroSocio').value) || 0
  return {
    nroSocio,
    nombreYApellido: String(celdaSocio(row, 'nombreYApellido').value ?? ''),
    domicilio: String(celdaSocio(row, 'domicilio').value ?? ''),
    dni: Number(celdaSocio(row, 'dni').value) || 0,
    fechaNacimiento: parseFecha(celdaSocio(row, 'fechaNacimiento').value, null)[0],
    telefono,
    caracterSocio: String(celdaSocio(row, 'caracterSocio').value || ''),
    fechaIngreso,
    fechaEgreso,
    observaciones: String(celdaSocio(row, 'observaciones').value ?? ''),
    email: getCellString(celdaSocio(row, 'email')),
    sociosVinculados: getSociosVinculados(celdaSocio(row, 'sociosVinculados')),
  }
}

export function getSociosVinculados(cell: ExcelJS.Cell): NroSocio[] {
  const value = getCellString(cell)
  if (!value.trim()) return []

  const socios = value.toString().split('-').map(n => Number(n || -1))
  return socios.filter(n => n >= 0)
}

export function formatSociosVinculado(sociosVinculados: NroSocio[]): string {
  if (!sociosVinculados.length) return ''
  return sociosVinculados.join('-')
}


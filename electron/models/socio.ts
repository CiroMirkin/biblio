import type ExcelJS from 'exceljs'
import { getCellString } from '../utils/excelhelpers'
import { parseFecha } from '../utils/parseFecha'
import type { Socio, NroSocio } from '@shared/models/socio'

export function writeSocio(row: ExcelJS.Row, socio: Socio): void {
  row.getCell(2).value = socio.nombreYApellido ?? ""
  row.getCell(3).value = socio.domicilio ?? ""
  row.getCell(4).value = socio.dni ?? ""
  row.getCell(5).value = socio.fechaNacimiento ? String(socio.fechaNacimiento) : ""
  row.getCell(6).value = socio.telefono ?? ""
  row.getCell(7).value = socio.caracterSocio ?? ""
  row.getCell(8).value = socio.fechaIngreso ? String(socio.fechaIngreso) : ""
  row.getCell(9).value = socio.fechaEgreso ? String(socio.fechaEgreso) : ""
  row.getCell(10).value = String(socio.observaciones ?? "")
  row.getCell(11).value = String(socio.email ?? "")
  row.getCell(12).value = formatSociosVinculado(socio.sociosVinculados)
}

export function rowToSocio(row: ExcelJS.Row): Socio {
  const telefonoRaw = row.getCell(6).value
  const telefono = telefonoRaw && telefonoRaw !== 0 ? String(telefonoRaw) : null

  const [fechaIngreso, fechaEgreso] = parseFecha(row.getCell(8).value, row.getCell(9).value)

  const nroSocio = Number(row.getCell(1).value) || 0
  return {
    nroSocio,
    nombreYApellido: String(row.getCell(2).value ?? ''),
    domicilio: String(row.getCell(3).value ?? ''),
    dni: Number(row.getCell(4).value) || 0,
    fechaNacimiento: parseFecha(row.getCell(5).value, null)[0],
    telefono,
    caracterSocio: String(row.getCell(7).value || ''),
    fechaIngreso,
    fechaEgreso,
    observaciones: String(row.getCell(10).value ?? ''),
    email: getCellString(row.getCell(11)),
    sociosVinculados: getSociosVinculados(row.getCell(12)),
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


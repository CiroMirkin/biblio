import type ExcelJS from 'exceljs'
import { holdingVacio, type LibroRegistrado } from '@shared/models/libro'

export const COLUMNAS_PRESTAMO = {
  idPrestamo: 1,
  nroLibro: 2,
  nroSocio: 3,
  nombreSocio: 4,
  fechaPrestamo: 5,
  titulo: 6,
  autor: 7,
} as const

/** Préstamo activo. titulo y autor son una copia del catálogo al momento de prestar */
export interface Prestamo {
  idPrestamo: string
  nroLibro: string
  nroSocio: number | null
  nombreSocio: string
  fechaPrestamo: Date | null
  titulo: string
  autor: string
}

export const celdaPrestamo = (row: ExcelJS.Row, campo: keyof typeof COLUMNAS_PRESTAMO) =>
  row.getCell(COLUMNAS_PRESTAMO[campo])

export function rowToPrestamo(row: ExcelJS.Row): Prestamo {
  const fecha = celdaPrestamo(row, 'fechaPrestamo').value
  const nroSocio = celdaPrestamo(row, 'nroSocio').value
  return {
    idPrestamo: String(celdaPrestamo(row, 'idPrestamo').value ?? ''),
    nroLibro: String(celdaPrestamo(row, 'nroLibro').value ?? ''),
    nroSocio: nroSocio === null || nroSocio === '' ? null : Number(nroSocio),
    nombreSocio: String(celdaPrestamo(row, 'nombreSocio').value ?? ''),
    fechaPrestamo: fecha instanceof Date ? fecha : fecha ? new Date(String(fecha)) : null,
    titulo: String(celdaPrestamo(row, 'titulo').value ?? ''),
    autor: String(celdaPrestamo(row, 'autor').value ?? ''),
  }
}

export function writePrestamo(row: ExcelJS.Row, prestamo: Prestamo): void {
  for (const campo of Object.keys(COLUMNAS_PRESTAMO) as (keyof Prestamo)[]) {
    celdaPrestamo(row, campo).value = prestamo[campo]
  }
  row.commit()
}

export const prestamoALibro = (prestamo: Prestamo): LibroRegistrado => ({
  titulo: prestamo.titulo,
  autor: prestamo.autor || undefined,
  numeroInventario: prestamo.nroLibro,
  nombreSocio: prestamo.nombreSocio,
  numeroSocio: prestamo.nroSocio,
  fechaDePrestamo: prestamo.fechaPrestamo,
  holding: holdingVacio(),
})

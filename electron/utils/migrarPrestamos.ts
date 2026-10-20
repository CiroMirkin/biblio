import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { PRESTAMOS_XLSX_PATH } from '../constants'
import { celdaLibro, esSinInventariar, getFechaDePrestamoFromRow, getNroDeInventarioFromRow, limpiarPrestamo } from '../models/libro'
import { rowToHistorialEntry } from '../models/historial'
import type { Prestamo } from '../models/prestamo'
import { crearPrestamos, leerHistorial, modificarLibros } from './datosExcel'

/**
 * Pasa los préstamos activos de las columnas 1-3 de libros.xlsx a prestamos.xlsx. Corre una sola vez, cuando prestamos.xlsx no existe.
 * Si se corta después de crear prestamos.xlsx las columnas viejas quedan cargadas pero ya nadie las lee.
 */
export async function migrarPrestamos() {
  if (fs.existsSync(PRESTAMOS_XLSX_PATH)) return

  const abiertos = await leerHistorial(({ worksheet }) => {
    const ids = new Map<string, string>()
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return
      const entry = rowToHistorialEntry(row)
      if (entry && !entry.fechaDevolucion) ids.set(entry.nroLibro, entry.idPrestamo)
    })
    return ids
  })

  await modificarLibros(async ({ worksheet, writeWorkbook }) => {
    const prestamos: Prestamo[] = []
    const filasPrestadas: number[] = []

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return
      const fechaPrestamo = getFechaDePrestamoFromRow(row)
      const nombreSocio = String(celdaLibro(row, 'nombreSocio').value ?? '')
      const rawNroSocio = celdaLibro(row, 'numeroSocio').value
      const nroSocio = rawNroSocio === null || rawNroSocio === '' ? null : Number(rawNroSocio)
      if (!fechaPrestamo && !nombreSocio && !nroSocio) return

      const nroLibro = getNroDeInventarioFromRow(row)
      prestamos.push({
        idPrestamo: abiertos.get(nroLibro) ?? randomUUID(),
        nroLibro,
        nroSocio,
        nombreSocio,
        fechaPrestamo,
        titulo: String(celdaLibro(row, 'titulo').value ?? ''),
        autor: String(celdaLibro(row, 'autor').value ?? ''),
      })
      filasPrestadas.push(rowIndex)
    })

    await crearPrestamos(prestamos)
    if (filasPrestadas.length === 0) return

    for (const rowIndex of filasPrestadas.reverse()) {
      const row = worksheet.getRow(rowIndex)
      if (esSinInventariar(getNroDeInventarioFromRow(row))) worksheet.spliceRows(rowIndex, 1)
      else limpiarPrestamo(row)
    }
    await writeWorkbook()
  })
}

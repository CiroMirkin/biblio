import type ExcelJS from 'exceljs'
import { randomUUID } from 'node:crypto'
import { getHistorialWorksheet } from '../constants'

export interface HistorialEntry {
  idPrestamo: string
  fechaPrestamo: Date
  fechaDevolucion: Date | null
  nroSocio: number
  nroLibro: string
}

function parseFecha(value: ExcelJS.CellValue): Date | null {
  const fecha = value instanceof Date ? value : new Date(String(value ?? ''))
  return isNaN(fecha.getTime()) ? null : fecha
}

function rowToHistorialEntry(row: ExcelJS.Row): HistorialEntry | null {
  const fechaPrestamo = parseFecha(row.getCell(2).value)
  if (!fechaPrestamo) return null

  const fechaDevolucionValue = row.getCell(3).value
  const fechaDevolucion = fechaDevolucionValue ? parseFecha(fechaDevolucionValue) : null

  return {
    idPrestamo: String(row.getCell(1).value ?? ''),
    fechaPrestamo,
    fechaDevolucion,
    nroSocio: Number(row.getCell(4).value) || 0,
    nroLibro: String(row.getCell(5).value ?? ''),
  }
}

export async function insertarHistorial(fechaPrestamo: Date, nroSocio: number, nroLibro: string): Promise<string> {
  const { worksheet, writeWorkbook } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  const idPrestamo = randomUUID()
  const row = worksheet.addRow([idPrestamo, fechaPrestamo, null, nroSocio, nroLibro])
  row.commit()
  await writeWorkbook()
  return idPrestamo
}

export async function actualizarFechaDevolucion(idPrestamo: string, fechaDevolucion: Date): Promise<boolean> {
  const { worksheet, writeWorkbook } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    if (String(row.getCell(1).value ?? '') === idPrestamo) {
      row.getCell(3).value = fechaDevolucion
      row.commit()
      await writeWorkbook()
      return true
    }
  }
  return false
}

export async function getHistorialSocio(nroSocio: number): Promise<HistorialEntry[]> {
  const { worksheet } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  const results: HistorialEntry[] = []
  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    if (Number(row.getCell(4).value) === nroSocio) {
      const entry = rowToHistorialEntry(row)
      if(entry) results.push()
    }
  }
  return results
}

export async function getHistorialLibro(nroLibro: string): Promise<HistorialEntry[]> {
  const { worksheet } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  const results: HistorialEntry[] = []
  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    if (String(row.getCell(5).value ?? '') === nroLibro) {
      const entry = rowToHistorialEntry(row)
      if(entry) results.push(entry)
    }
  }
  return results
}

export async function eliminarHistorialAnio(anio: number): Promise<number> {
  const { worksheet, writeWorkbook } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  const filasAEliminar: number[] = []
  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    const fecha = row.getCell(2).value
    if (fecha instanceof Date && fecha.getFullYear() === anio) {
      filasAEliminar.push(i)
    } else if (fecha && !(fecha instanceof Date)) {
      const parsed = new Date(String(fecha))
      if (!isNaN(parsed.getTime()) && parsed.getFullYear() === anio) {
        filasAEliminar.push(i)
      }
    }
  }

  filasAEliminar.sort((a, b) => b - a)
  for (const fila of filasAEliminar) {
    worksheet.getRow(fila).splice(1, worksheet.columnCount)
  }

  await writeWorkbook()
  return filasAEliminar.length
}

export async function actualizarNroLibroEnHistorial(viejoNro: string, nuevoNro: string): Promise<number> {
  const { worksheet, writeWorkbook } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  let contador = 0
  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    if (String(row.getCell(5).value ?? '') === viejoNro) {
      row.getCell(5).value = nuevoNro
      row.commit()
      contador++
    }
  }

  if (contador > 0) {
    await writeWorkbook()
  }
  return contador
}

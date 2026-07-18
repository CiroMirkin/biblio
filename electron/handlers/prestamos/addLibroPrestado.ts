import ExcelJS from 'exceljs'
import type { LibroEnPrestamo } from "@shared/models/libro"
import { esSinInventariar, generarIdSinInventariar, getFechaDePrestamoFromRow, getNroDeInventarioFromRow, libroToRow, rowToLibro, writeLibro } from "../../models/libro"
import { LIBROS_XLSX_PATH } from '../../constants'
import { insertarHistorial } from '../historial'

export async function addLibroPrestado(libro: LibroEnPrestamo, fecha?: Date): Promise<LibroEnPrestamo | null> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return null

  if(!libro.titulo) return null

  let targetRow: ExcelJS.Row | null = null
  const date = fecha ? fecha : new Date()
  const numeroInventario = libro.numeroInventario || generarIdSinInventariar()

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    if (getNroDeInventarioFromRow(row) === String(libro.numeroInventario)) {
      targetRow = row
    }
  })

  if (targetRow) {
    if (getFechaDePrestamoFromRow(targetRow)) {
      return null
    }

    writeLibro(targetRow, {
      ...rowToLibro(targetRow),
      nombreSocio: libro.nombreSocio,
      numeroSocio: libro.numeroSocio ?? null,
      fechaDePrestamo: date,
    })
  }
  else {
    const newRow = worksheet.addRow(libroToRow({
      nombreSocio: libro.nombreSocio,
      numeroSocio: libro.numeroSocio ?? null,
      fechaDePrestamo: date,
      autor: libro.autor,
      titulo: libro.titulo,
      numeroInventario,
      fechaDeIngreso: new Date(),
    }))
    newRow.commit()
  }

  await workbook.xlsx.writeFile(LIBROS_XLSX_PATH)

  if (libro.numeroSocio && !esSinInventariar(numeroInventario)) {
    await insertarHistorial(date, libro.numeroSocio, String(numeroInventario))
  }

  return {
    ...libro,
    numeroInventario,
    fechaDePrestamo: date,
  }
}
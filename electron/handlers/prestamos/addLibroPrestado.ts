import type ExcelJS from 'exceljs'
import type { LibroEnPrestamo } from "@shared/models/libro"
import { esSinInventariar, generarIdSinInventariar, getFechaDePrestamoFromRow, getNroDeInventarioFromRow, libroToRow, rowToLibro, writeLibro } from "../../models/libro"
import { modificarLibros } from '../../utils/datosExcel'
import { insertarHistorial } from '../historial'

export async function addLibroPrestado(libro: LibroEnPrestamo, fecha?: Date): Promise<LibroEnPrestamo | null> {
  const date = fecha ? fecha : new Date()
  const numeroInventario = libro.numeroInventario || generarIdSinInventariar()

  const prestado = await modificarLibros(async ({ worksheet, writeWorkbook }) => {
    if(!libro.titulo) return false

    let targetRow: ExcelJS.Row | null = null

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return

      if (getNroDeInventarioFromRow(row) === String(libro.numeroInventario)) {
        targetRow = row
      }
    })

    if (targetRow) {
      if (getFechaDePrestamoFromRow(targetRow)) {
        return false
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

    await writeWorkbook()
    return true
  })

  if (!prestado) return null

  if (libro.numeroSocio && !esSinInventariar(numeroInventario)) {
    await insertarHistorial(date, libro.numeroSocio, String(numeroInventario))
  }

  return {
    ...libro,
    numeroInventario,
    fechaDePrestamo: date,
  }
}
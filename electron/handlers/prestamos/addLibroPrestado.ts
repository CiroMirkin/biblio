import { randomUUID } from 'node:crypto'
import { holdingVacio, type LibroRegistrado } from "@shared/models/libro"
import { esSinInventariar, generarIdSinInventariar, getNroDeInventarioFromRow, rowToLibro, writeLibro } from "../../models/libro"
import { rowToPrestamo, writePrestamo } from '../../models/prestamo'
import { leerLibros, modificarLibros, modificarPrestamos } from '../../utils/datosExcel'
import { insertarHistorial } from '../historial'

export async function addLibroPrestado(libro: LibroRegistrado, fecha?: Date): Promise<LibroRegistrado | null> {
  if (!libro.titulo) return null

  const date = fecha ? fecha : new Date()
  const numeroInventario = String(libro.numeroInventario || generarIdSinInventariar())
  const sinInventariar = esSinInventariar(numeroInventario)

  const enCatalogo = sinInventariar ? undefined : await leerLibros(({ worksheet }) => {
    let encontrado: ReturnType<typeof rowToLibro> | undefined
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1 || encontrado) return
      if (getNroDeInventarioFromRow(row) === numeroInventario) encontrado = rowToLibro(row)
    })
    return encontrado
  })

  const idPrestamo = randomUUID()
  const prestado = await modificarPrestamos(async ({ worksheet, writeWorkbook }) => {
    let yaPrestado = false
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return
      if (rowToPrestamo(row).nroLibro === numeroInventario) yaPrestado = true
    })
    if (yaPrestado) return false

    writePrestamo(worksheet.addRow([]), {
      idPrestamo,
      nroLibro: numeroInventario,
      nroSocio: libro.numeroSocio ?? null,
      nombreSocio: libro.nombreSocio ?? '',
      fechaPrestamo: date,
      titulo: enCatalogo?.titulo ?? libro.titulo,
      autor: (enCatalogo ? enCatalogo.autor : libro.autor) ?? '',
    })
    await writeWorkbook()
    return true
  })

  if (!prestado) return null

  // un número de inventario que no está en el catálogo se da de alta al prestarlo
  if (!sinInventariar && !enCatalogo) {
    await modificarLibros(async ({ worksheet, writeWorkbook }) => {
      writeLibro(worksheet.getRow(worksheet.rowCount + 1), {
        autor: libro.autor,
        titulo: libro.titulo,
        numeroInventario,
        fechaDeIngreso: new Date(),
        holding: holdingVacio(),
      })
      await writeWorkbook()
    })
  }

  if (libro.numeroSocio && !sinInventariar) {
    await insertarHistorial(date, libro.numeroSocio, numeroInventario, idPrestamo)
  }

  return {
    ...libro,
    numeroInventario: libro.numeroInventario || numeroInventario,
    fechaDePrestamo: date,
  }
}

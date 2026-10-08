import type { Libro } from '@shared/models/libro'
import { rowToPrestamo, writePrestamo, type Prestamo } from '../../models/prestamo'
import { modificarPrestamos } from '../../utils/datosExcel'

/** Copia número, título y autor del libro editado a su préstamo activo. */
export const actualizarLibroEnPrestamo = async (nroViejo: string, libro: Libro): Promise<Prestamo | null> => (
  modificarPrestamos(async ({ worksheet, writeWorkbook }) => {
    let actualizado: Prestamo | null = null

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1 || actualizado) return
      const prestamo = rowToPrestamo(row)
      if (prestamo.nroLibro !== nroViejo) return

      actualizado = {
        ...prestamo,
        nroLibro: String(libro.numeroInventario),
        titulo: libro.titulo,
        autor: libro.autor ?? '',
      }
      writePrestamo(row, actualizado)
    })

    if (!actualizado) return null
    await writeWorkbook()
    return actualizado as Prestamo
  })
)

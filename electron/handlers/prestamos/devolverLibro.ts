import { modificarPrestamos } from '../../utils/datosExcel'
import { esSinInventariar } from "../../models/libro"
import { rowToPrestamo, type Prestamo } from '../../models/prestamo'
import { actualizarFechaDevolucion } from '../historial'

export async function devolverLibro(numeroInventario: number | string): Promise<boolean> {
  const devuelto = await modificarPrestamos(async ({ worksheet, writeWorkbook }) => {
    let prestamo: Prestamo | null = null
    let fila = 0

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1 || prestamo) return
      const actual = rowToPrestamo(row)
      if (actual.nroLibro === String(numeroInventario)) {
        prestamo = actual
        fila = rowIndex
      }
    })

    if (!prestamo) return null

    worksheet.spliceRows(fila, 1)
    await writeWorkbook()
    return prestamo as Prestamo
  })

  if (!devuelto) return false
  if (!esSinInventariar(numeroInventario)) await actualizarFechaDevolucion(devuelto.idPrestamo)
  return true
}

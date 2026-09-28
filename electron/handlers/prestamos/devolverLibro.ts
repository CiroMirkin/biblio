import { modificarLibros } from '../../utils/datosExcel'
import { esSinInventariar, getNroDeInventarioFromRow, limpiarPrestamo } from "../../models/libro"
import { actualizarFechaDevolucion } from '../historial'

export async function devolverLibro(numeroInventario: number | string): Promise<boolean> {
  const devuelto = await modificarLibros(async ({ worksheet, writeWorkbook }) => {
    if (!worksheet) return false

    let found = false
    const rowsToDelete: number[] = []

    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex === 1) return
      const nroInventario = getNroDeInventarioFromRow(row)

      if(nroInventario === numeroInventario.toString()) {
        found = true

        if (esSinInventariar(numeroInventario)) {
          rowsToDelete.push(rowIndex)
        }
        else {
          limpiarPrestamo(row)
        }
      }
    })

    if (!found) return false

    for (const rowIndex of rowsToDelete.reverse()) {
      worksheet.spliceRows(rowIndex, 1)
    }

    await writeWorkbook()
    return true
  })

  if (!devuelto) return false
  if(!esSinInventariar(numeroInventario)) await actualizarFechaDevolucion(String(numeroInventario))
  return true
}

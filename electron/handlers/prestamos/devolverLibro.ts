import { getLibrosWorksheet } from '../../constants'
import { esSinInventariar, getNroDeInventarioFromRow, limpiarPrestamo } from "../../models/libro"
import { actualizarFechaDevolucion } from '../historial'

export async function devolverLibro(numeroInventario: number | string): Promise<boolean> {
  const { worksheet, writeWorkbook } = await getLibrosWorksheet()
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
  if(!esSinInventariar(numeroInventario)) await actualizarFechaDevolucion(String(numeroInventario))
  return true
}

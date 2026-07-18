import ExcelJS from 'exceljs'
import { LIBROS_XLSX_PATH } from '../../constants'
import { esSinInventariar, getNroDeInventarioFromRow, limpiarPrestamo } from "../../models/libro"
import { actualizarFechaDevolucion } from '../historial'

export async function devolverLibro(numeroInventario: number | string): Promise<boolean> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
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

  await workbook.xlsx.writeFile(LIBROS_XLSX_PATH)
  await actualizarFechaDevolucion(String(numeroInventario))
  return true
}

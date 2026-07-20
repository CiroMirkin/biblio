import { getHistorialWorksheet } from '../../constants'
import { getHistorialLibro } from './getHistorialLibro'

export async function actualizarFechaDevolucion(numeroInventario: string): Promise<boolean> {
  try {
    const { worksheet, writeWorkbook } = await getHistorialWorksheet()
    if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

    const entries = await getHistorialLibro(String(numeroInventario))
    const historyEntry = entries.find(e => e.fechaDevolucion === null)
    if (!historyEntry) return false

    const idPrestamo = historyEntry.idPrestamo
    const fechaDevolucion = new Date()
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
  catch {
    return false
  }
}
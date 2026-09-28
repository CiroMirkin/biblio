import { modificarHistorial } from '../../utils/datosExcel'
import { getHistorialLibro } from './getHistorialLibro'

export async function actualizarFechaDevolucion(numeroInventario: string): Promise<boolean> {
  try {
    return await modificarHistorial(async ({ worksheet, writeWorkbook }) => {
      if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

      // No se bloquea esperando su propio turno porque hojaExcel deja pasar accesos al mismo archivo desde dentro de la operación.
      // En cambio leer otro archivo lanzaría un error.
      const entries = await getHistorialLibro(String(numeroInventario))
      const historyEntry = entries.find(e => e.fechaDevolucion === null)
      if (!historyEntry) return false

      const idPrestamo = historyEntry.idPrestamo
      const fechaDevolucion = new Date()
      for (let i = 1; i <= worksheet.actualRowCount; i++) {
        const row = worksheet.getRow(i)
        const id = String(row.getCell(1).value ?? '')
        if (id === idPrestamo) {
          row.getCell(3).value = fechaDevolucion
          row.commit()
          await writeWorkbook()
          return true
        }
      }
      return false
    })
  }
  catch {
    return false
  }
}
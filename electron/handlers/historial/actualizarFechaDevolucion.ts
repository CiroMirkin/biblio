import { modificarHistorial } from '../../utils/datosExcel'
import { celdaHistorial } from '../../models/historial'

export async function actualizarFechaDevolucion(idPrestamo: string): Promise<boolean> {
  try {
    return await modificarHistorial(async ({ worksheet, writeWorkbook }) => {
      for (let i = 1; i <= worksheet.actualRowCount; i++) {
        const row = worksheet.getRow(i)
        if (String(celdaHistorial(row, 'idPrestamo').value ?? '') === idPrestamo) {
          celdaHistorial(row, 'fechaDevolucion').value = new Date()
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

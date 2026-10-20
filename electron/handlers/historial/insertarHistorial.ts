import { randomUUID } from 'node:crypto'
import { modificarHistorial } from '../../utils/datosExcel'
import { writeHistorialEntry } from '../../models/historial'

export async function insertarHistorial(fechaPrestamo: Date, nroSocio: number, nroLibro: string, idPrestamo: string = randomUUID()): Promise<string> {
  try {
    return await modificarHistorial(async ({ worksheet, writeWorkbook }) => {
      const row = worksheet.addRow([])
      writeHistorialEntry(row, { idPrestamo, fechaPrestamo, fechaDevolucion: null, nroSocio, nroLibro })
      row.commit()
      await writeWorkbook()
      return idPrestamo
    })
  }
  catch {
    return ''
  }
}

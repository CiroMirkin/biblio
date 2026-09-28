import { randomUUID } from 'node:crypto'
import { modificarHistorial } from '../../constants'

export async function insertarHistorial(fechaPrestamo: Date, nroSocio: number, nroLibro: string): Promise<string> {
  try {
    return await modificarHistorial(async ({ worksheet, writeWorkbook }) => {
      if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

      const idPrestamo = randomUUID()
      const row = worksheet.addRow([idPrestamo, fechaPrestamo, null, nroSocio, nroLibro])
      row.commit()
      await writeWorkbook()
      return idPrestamo
    })
  }
  catch {
    return ''
  }
}

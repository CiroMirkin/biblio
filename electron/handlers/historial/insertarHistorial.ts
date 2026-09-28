import { randomUUID } from 'node:crypto'
import { modificarHistorial } from '../../utils/datosExcel'

export async function insertarHistorial(fechaPrestamo: Date, nroSocio: number, nroLibro: string): Promise<string> {
  try {
    return await modificarHistorial(async ({ worksheet, writeWorkbook }) => {
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

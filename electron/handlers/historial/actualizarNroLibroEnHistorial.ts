import { modificarHistorial } from '../../utils/datosExcel'
import { celdaHistorial } from '../../models/historial'

export async function actualizarNroLibroEnHistorial(viejoNro: string, nuevoNro: string): Promise<string> {
  try {
    return await modificarHistorial(async ({ worksheet, writeWorkbook }) => {
      let contador = 0
      for (let i = 1; i <= worksheet.actualRowCount; i++) {
        const row = worksheet.getRow(i)
        const nro = String(celdaHistorial(row, 'nroLibro').value ?? '')
        if (nro === viejoNro) {
          celdaHistorial(row, 'nroLibro').value = nuevoNro
          row.commit()
          contador++
        }
      }

      if (contador > 0) {
        await writeWorkbook()
      }
      return String(contador)
    })
  }
  catch {
    return viejoNro
  }
}

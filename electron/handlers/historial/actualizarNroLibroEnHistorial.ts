import { modificarHistorial } from '../../utils/datosExcel'

export async function actualizarNroLibroEnHistorial(viejoNro: string, nuevoNro: string): Promise<string> {
  try {
    return await modificarHistorial(async ({ worksheet, writeWorkbook }) => {
      if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

      let contador = 0
      for (let i = 1; i <= worksheet.actualRowCount; i++) {
        const row = worksheet.getRow(i)
        const nro = String(row.getCell(5).value ?? '')
        if (nro === viejoNro) {
          row.getCell(5).value = nuevoNro
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

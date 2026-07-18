import { getHistorialWorksheet } from '../../constants'

export async function actualizarNroLibroEnHistorial(viejoNro: string, nuevoNro: string): Promise<number> {
  const { worksheet, writeWorkbook } = await getHistorialWorksheet()
  if (!worksheet) throw new Error('No se pudo obtener la hoja de historial')

  let contador = 0
  for (let i = 1; i <= worksheet.actualRowCount; i++) {
    const row = worksheet.getRow(i)
    if (String(row.getCell(5).value ?? '') === viejoNro) {
      row.getCell(5).value = nuevoNro
      row.commit()
      contador++
    }
  }

  if (contador > 0) {
    await writeWorkbook()
  }
  return contador
}

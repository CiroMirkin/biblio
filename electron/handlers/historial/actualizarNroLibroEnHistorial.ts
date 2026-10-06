import { aniosArchivados, historialArchivado, modificarHistorial } from '../../utils/datosExcel'
import type { HojaExcel } from '../../utils/hojaExcel'

export async function actualizarNroLibroEnHistorial(viejoNro: string, nuevoNro: string): Promise<string> {
  const renumerar = async ({ worksheet, writeWorkbook }: HojaExcel) => {
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
    return contador
  }

  try {
    let contador = await modificarHistorial(renumerar)
    for (const anio of await aniosArchivados()) {
      contador += await historialArchivado(anio).modificar(renumerar)
    }
    return String(contador)
  }
  catch {
    return viejoNro
  }
}

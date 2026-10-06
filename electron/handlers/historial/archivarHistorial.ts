import type ExcelJS from 'exceljs'
import type { EstadoHistorial, HistorialEntry } from '@shared/models'
import { aniosArchivados, historialArchivado, leerHistorial, modificarHistorial } from '../../utils/datosExcel'
import { historialEntries, rowToHistorialEntry } from '../../models/historial'

export const LIMITE_HISTORIAL = 7000

// Un registro pertenece al año en que se devolvió. Los préstamos abiertos no tienen año y nunca se archivan.
function filasPorAnio(worksheet: ExcelJS.Worksheet) {
  const filas: { anio: number | null, valores: ExcelJS.CellValue[] }[] = []
  worksheet.eachRow((row, nroFila) => {
    if (nroFila === 1) return
    filas.push({
      anio: rowToHistorialEntry(row)?.fechaDevolucion?.getFullYear() ?? null,
      valores: [1, 2, 3, 4, 5].map(columna => row.getCell(columna).value),
    })
  })
  return filas
}

function anioMasAntiguo(filas: { anio: number | null }[]) {
  const anios = filas.map(f => f.anio).filter(anio => anio !== null)
  return anios.length ? Math.min(...anios) : null
}

export async function getEstadoHistorial(): Promise<EstadoHistorial> {
  return leerHistorial(({ worksheet }) => {
    const filas = filasPorAnio(worksheet)
    const anio = anioMasAntiguo(filas)
    return {
      registros: filas.length,
      limite: LIMITE_HISTORIAL,
      anio,
      cantidad: filas.filter(f => f.anio === anio).length,
    }
  })
}

/** Primero copia al archivo del año y después borra del principal, si falla a mitad quedan duplicados pero nunca se pierden registros */
export async function archivarAnioMasAntiguo(): Promise<{ anio: number, cantidad: number } | null> {
  try {
    const filas = await leerHistorial(({ worksheet }) => filasPorAnio(worksheet))
    const anio = anioMasAntiguo(filas)
    if (anio === null) return null

    const aArchivar = filas.filter(f => f.anio === anio)
    await historialArchivado(anio).modificar(async ({ worksheet, writeWorkbook }) => {
      worksheet.addRows(aArchivar.map(f => f.valores))
      await writeWorkbook()
    })

    await modificarHistorial(async ({ worksheet, writeWorkbook }) => {
      const restantes = filasPorAnio(worksheet).filter(f => f.anio !== anio)
      // spliceRows de ExcelJS no borra las filas que llegan hasta el final de la hoja, por eso se recrea
      const { workbook, name } = worksheet
      const encabezado = worksheet.getRow(1).values
      workbook.removeWorksheet(worksheet.id)
      const nueva = workbook.addWorksheet(name)
      nueva.addRow(encabezado)
      nueva.addRows(restantes.map(f => f.valores))
      await writeWorkbook()
    })

    return { anio, cantidad: aArchivar.length }
  }
  catch {
    return null
  }
}

export async function buscarEnHistorialArchivado(filtro: (entry: HistorialEntry) => boolean): Promise<HistorialEntry[]> {
  const resultados: HistorialEntry[] = []
  for (const anio of await aniosArchivados()) {
    resultados.push(...await historialArchivado(anio).leer(({ worksheet }) => historialEntries(worksheet).filter(filtro)))
  }
  return resultados
}

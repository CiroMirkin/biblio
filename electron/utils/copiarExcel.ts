import { dialog } from 'electron'
import fs from 'node:fs/promises'
import { CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH, SOCIOS_XLSX_PATH } from '../constants'

const ARCHIVOS = {
  socios: SOCIOS_XLSX_PATH,
  cuotas: CUOTAS_XLSX_PATH,
  libros: LIBROS_XLSX_PATH,
} as const

export type ArchivoKey = keyof typeof ARCHIVOS

export const copiarExcel = async (key: ArchivoKey) => {
  const origen = ARCHIVOS[key]

  const fecha = new Date().toLocaleDateString(
    'es-AR',
    { day: '2-digit', month: '2-digit', year: '2-digit' }
  ).replace(/\//g, '-')

  const { filePath, canceled } = await dialog.showSaveDialog({
    defaultPath: `${key}_COPIA_(${fecha}).xlsx`,
    filters: [{ name: 'Excel', extensions: ['xlsx'] }],
  })

  if (canceled || !filePath) return false

  await fs.copyFile(origen, filePath)
  return true
}

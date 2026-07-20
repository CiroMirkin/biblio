import { dialog } from 'electron'
import fs from 'node:fs/promises'
import { excelAMrc } from './crearArchivoMrc'
import os from 'node:os'
import path from 'node:path'

export const descargarMrc = async (excluirSinIsbn?: boolean) => {
  const fecha = new Date().toLocaleDateString(
    'es-AR',
    { day: '2-digit', month: '2-digit', year: '2-digit' }
  ).replace(/\//g, '-')

  const { filePath, canceled } = await dialog.showSaveDialog({
    defaultPath: `catalogo_koha_(${fecha}).mrc`,
    filters: [{ name: 'MARC 21', extensions: ['mrc'] }],
  })

  if (canceled || !filePath) return false

  const tmp = path.join(os.tmpdir(), `koha_${Date.now()}.mrc`)

  try {
    await excelAMrc({
      outputPath: tmp,
      excluirSinIsbn,
    })
    await fs.copyFile(tmp, filePath)
    
    return true
  }
  finally {
    await fs.rm(tmp, { force: true })
  }
}
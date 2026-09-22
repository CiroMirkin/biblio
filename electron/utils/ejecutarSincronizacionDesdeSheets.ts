import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs'
import { LIBROS_XLSX_PATH, SCRIPT_SINCRONIZAR_SHEETS_PATH, SHEET_URL_TXT_PATH, SINCRONIZACION_LOG_PATH } from '../constants'

const execFileAsync = promisify(execFile)

export type ResultadoSincronizacion =
  | { ok: true, cantidad: number }
  | { ok: false, error: string }

export async function ejecutarSincronizacionDesdeSheets(): Promise<ResultadoSincronizacion> {
  let sheetUrl: string
  try {
    sheetUrl = fs.readFileSync(SHEET_URL_TXT_PATH, 'utf8').trim()
  } catch {
    return { ok: false, error: `No se encontró ${SHEET_URL_TXT_PATH}` }
  }

  try {
    const { stdout } = await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-File', SCRIPT_SINCRONIZAR_SHEETS_PATH,
      '-SheetCsvUrl', sheetUrl,
      '-ExcelPath', LIBROS_XLSX_PATH,
      '-LogPath', SINCRONIZACION_LOG_PATH,
    ])
    return { ok: true, cantidad: Number(stdout.trim()) || 0 }
  } catch (error) {
    const stderr = (error as { stderr?: string })?.stderr?.trim()
    return { ok: false, error: stderr || (error as Error).message }
  }
}

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs'
import { SHEET_URL_TXT_PATH } from '../constants'

const execFileAsync = promisify(execFile)

async function hayPowerShellConImportExcel(): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync('powershell.exe', [
      '-NoProfile',
      '-Command',
      'if (Get-Module -ListAvailable -Name ImportExcel) { "ok" }',
    ])
    return stdout.trim() === 'ok'
  } catch {
    return false
  }
}

function haySheetUrlConfigurada(): boolean {
  try {
    return fs.readFileSync(SHEET_URL_TXT_PATH, 'utf8').trim().length > 0
  } catch {
    return false
  }
}

let chequeoEnCurso: Promise<boolean> | null = null

// Corre el chequeo una sola vez por sesión (memoizado en esta promesa) y cachea el resultado.
export function sincronizacionDisponible(): Promise<boolean> {
  if (!chequeoEnCurso) {
    chequeoEnCurso = hayPowerShellConImportExcel().then(psOk => psOk && haySheetUrlConfigurada())
  }
  return chequeoEnCurso
}

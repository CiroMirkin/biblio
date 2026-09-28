import { AsyncLocalStorage } from 'node:async_hooks'
import { stat } from 'node:fs/promises'
import ExcelJS from 'exceljs'

export type HojaLectura = { worksheet: ExcelJS.Worksheet | undefined }
export type HojaExcel = HojaLectura & { writeWorkbook: () => Promise<void> }

type Contexto = { path: string, workbook?: ExcelJS.Workbook, editado: boolean, escrito: boolean }

// pasan por modificarArchivo, que invalida explícitamente. Agregar hash si aparece el caso.
const cache = new Map<string, { workbook: ExcelJS.Workbook, mtimeMs: number, size: number }>()
const colas = new Map<string, Promise<unknown>>()
const archivoOcupado = new AsyncLocalStorage<Contexto>()

export const vaciarCache = () => cache.clear()

// si un callback espera algo que nunca resuelve (diálogo, IPC) el archivo queda bloqueado.
// Dentro de los callbacks solo trabajo sobre la hoja + writeWorkbook.
function conArchivoOcupado<T>(xlsxPath: string, fn: (ctx: Contexto) => Promise<T>): Promise<T> {
  const actual = archivoOcupado.getStore()
  if (actual?.path === xlsxPath) return fn(actual)
  if (actual) return Promise.reject(new Error(`Acceso a ${xlsxPath} dentro de ${actual.path}`))

  const previa = colas.get(xlsxPath) ?? Promise.resolve()
  const siguiente = previa.catch(() => {}).then(() => {
    const ctx: Contexto = { path: xlsxPath, editado: false, escrito: false }
    return archivoOcupado.run(ctx, async () => {
      try {
        const resultado = await fn(ctx)
        if (ctx.editado && !ctx.escrito) cache.delete(xlsxPath)
        return resultado
      }
      catch (error) {
        cache.delete(xlsxPath)
        throw error
      }
    })
  })
  colas.set(xlsxPath, siguiente)
  return siguiente
}

const statOrNull = (xlsxPath: string) => stat(xlsxPath).catch(() => null)

async function cargar(ctx: Contexto, crearSiFalta?: () => Promise<void>): Promise<ExcelJS.Workbook> {
  if (ctx.workbook) return ctx.workbook

  let stats = await statOrNull(ctx.path)
  if (!stats && crearSiFalta) {
    await crearSiFalta()
    stats = await statOrNull(ctx.path)
  }

  const enCache = cache.get(ctx.path)
  if (stats && enCache && enCache.mtimeMs === stats.mtimeMs && enCache.size === stats.size) {
    return ctx.workbook = enCache.workbook
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(ctx.path)
  if (stats) cache.set(ctx.path, { workbook, mtimeMs: stats.mtimeMs, size: stats.size })
  else cache.delete(ctx.path)
  return ctx.workbook = workbook
}

export function leerHoja<T>(
  xlsxPath: string,
  hoja: string,
  fn: (lectura: HojaLectura) => T | Promise<T>,
  crearSiFalta?: () => Promise<void>,
): Promise<T> {
  return conArchivoOcupado(xlsxPath, async ctx => {
    const workbook = await cargar(ctx, crearSiFalta)
    return fn({ worksheet: workbook.getWorksheet(hoja) })
  })
}

/**
 * Si el callback termina sin llamar a writeWorkbook, el workbook cacheado se descarta:
 * nunca queda viva una mutación que no llegó a disco.
 */
export function modificarHoja<T>(
  xlsxPath: string,
  hoja: string,
  fn: (edicion: HojaExcel) => T | Promise<T>,
  crearSiFalta?: () => Promise<void>,
): Promise<T> {
  return conArchivoOcupado(xlsxPath, async ctx => {
    ctx.editado = true
    const workbook = await cargar(ctx, crearSiFalta)
    const writeWorkbook = async () => {
      await workbook.xlsx.writeFile(xlsxPath)
      ctx.escrito = true
      const stats = await statOrNull(xlsxPath)
      if (stats) cache.set(xlsxPath, { workbook, mtimeMs: stats.mtimeMs, size: stats.size })
    }
    return fn({ worksheet: workbook.getWorksheet(hoja), writeWorkbook })
  })
}

/**
 * Para lo que toca el archivo sin pasar por ExcelJS (script de Sheets, copias, importación):
 * espera su turno en la cola y al terminar descarta el caché.
 */
export function modificarArchivo<T>(xlsxPath: string, fn: () => Promise<T>): Promise<T> {
  return conArchivoOcupado(xlsxPath, async ctx => {
    ctx.editado = true
    return fn()
  })
}

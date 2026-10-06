import type { HistorialEntry } from "@shared/models"

async function fetchHistorial<T>(fetch: () => Promise<T[]>): Promise<HistorialEntry[]> {
  const raw = await fetch()
  return (raw as unknown[]).map((entry) => {
    const e = entry as Record<string, unknown>
    return {
      ...e,
      fechaPrestamo: new Date(e.fechaPrestamo as string),
      fechaDevolucion: e.fechaDevolucion ? new Date(e.fechaDevolucion as string) : null,
    } as HistorialEntry
  })
}

export async function getHistorialSocio(nroSocio: number, archivado = false): Promise<HistorialEntry[]> {
  return fetchHistorial(() => window.electronAPI.getHistorialSocio(nroSocio, archivado))
}

export async function getHistorialLibro(nroLibro: string, archivado = false): Promise<HistorialEntry[]> {
  return fetchHistorial(() => window.electronAPI.getHistorialLibro(nroLibro, archivado))
}

export const getEstadoHistorial = () => window.electronAPI.getEstadoHistorial()
export const archivarHistorial = () => window.electronAPI.archivarHistorial()

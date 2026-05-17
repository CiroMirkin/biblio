import type { LibroEnPrestamo } from "@/models"

export async function cargarLibrosEnPrestamo(): Promise<LibroEnPrestamo[]> {
  const raw = await window.electronAPI.getLibros()

  return (raw as unknown[]).map(l => {
    const libro = l as Record<string, unknown>
    return {
      ...libro,
      fechaDePrestamo: libro.fechaDePrestamo ? new Date(libro.fechaDePrestamo as string) : null,
    }
  }) as LibroEnPrestamo[]
}

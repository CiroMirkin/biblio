import { create } from "zustand"
import type { LibroEnPrestamo } from "@/models"
import { cargarLibrosEnPrestamo } from "@/services/cargarLibrosEnPrestamo"

const DIAS_LIMITE = 40

function diasDesdePrestamo(fecha: Date): number {
  const hoy = new Date()
  const diff = hoy.getTime() - fecha.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

interface LibrosState {
  libros: LibroEnPrestamo[]
  librosVencidos: LibroEnPrestamo[]
  cargando: boolean

  inicializar: () => Promise<void>
}

export const useLibrosStore = create<LibrosState>((set) => ({
  libros: [],
  librosVencidos: [],
  cargando: false,

  inicializar: async () => {
    set({ cargando: true })
    const libros = await cargarLibrosEnPrestamo()
    const librosVencidos = libros.filter(
      l => l.fechaDePrestamo && diasDesdePrestamo(l.fechaDePrestamo) > DIAS_LIMITE
    )
    set({ libros, librosVencidos, cargando: false })
  },
}))

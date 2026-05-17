import { create } from "zustand"
import type { LibroEnPrestamo } from "@/models"
import { cargarLibrosEnPrestamo } from "@/services/cargarLibrosEnPrestamo"
import { calcularDiasDesdePrestamo, levenshtein } from "@/utils"

const DIAS_LIMITE = 40

interface LibrosState {
  libros: LibroEnPrestamo[]
  librosVencidos: LibroEnPrestamo[]
  librosFiltrados: LibroEnPrestamo[]

  inicializar: () => Promise<void>
  buscar: (query: string) => void
}

export const useLibrosStore = create<LibrosState>((set, get) => ({
  libros: [],
  librosVencidos: [],
  librosFiltrados: [],

  inicializar: async () => {
    const libros = await cargarLibrosEnPrestamo()
    const librosVencidos = libros.filter(
      l => l.fechaDePrestamo && calcularDiasDesdePrestamo(l.fechaDePrestamo) > DIAS_LIMITE
    )
    set({ libros, librosVencidos, librosFiltrados: [] })
  },

  buscar: (query) => {
    const { libros } = get()

    if (!query.trim()) {
      set({ librosFiltrados: [] })
      return
    }

    const q = query.toLowerCase().trim()

    const filtrados = libros.filter(libro => {
      if(libro.numeroSocio == 0 || !libro.nombreSocio.trim()) return false

      const titulo = libro.titulo.toLowerCase()
      if (titulo.includes(q)) return true

      return titulo.split(" ").some(palabra => {
        if (palabra.startsWith(q)) return true
        if (q.length < 5) return false
        if (Math.abs(palabra.length - q.length) > 1) return false
        return levenshtein(palabra, q) <= 1
      })
    })

    const ordenados = filtrados.sort((a, b) => {
      const ta = a.titulo.toLowerCase()
      const tb = b.titulo.toLowerCase()
      if (ta === q) return -1
      if (tb === q) return 1
      if (ta.startsWith(q) && !tb.startsWith(q)) return -1
      if (tb.startsWith(q) && !ta.startsWith(q)) return 1
      return ta.localeCompare(tb, 'es', { sensitivity: 'base' })
    })

    set({ librosFiltrados: ordenados })
  },
}))
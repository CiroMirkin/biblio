import { create } from "zustand"
import type { Libro, LibroEnPrestamo } from "@/models"
import { cargarLibrosEnPrestamo, settingsService } from "@/services"
import { calcularDiasDesdePrestamo, levenshtein } from "@/utils"

interface LibrosState {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
  libros: LibroEnPrestamo[]
  librosVencidos: LibroEnPrestamo[]
  librosFiltrados: LibroEnPrestamo[]
  librosDisponiblesFiltrados: Libro[]

  setMaximoLibrosEnPrestamo: (max: number) => number
  setLimiteDeDias: (limite: number) => number

  inicializar: () => Promise<void>
  buscar: (query: string) => void
  buscarDisponibles: (query: string) => void
  getLibrosSocio: (nombreSocio: string, nroSocio: number) => Promise<LibroEnPrestamo[]>
  agregarLibroEnPrestamo: (libro: Libro) => Promise<LibroEnPrestamo | null>
  devolverLibro: (nroInventario: number) => Promise<void>
  getLibroPorInventario: (nroInventario: number) => LibroEnPrestamo | null
}

export const useLibrosStore = create<LibrosState>((set, get) => ({
  limiteDeDias: 40,
  maximoLibrosEnPrestamo: 4,
  libros: [],
  librosVencidos: [],
  librosFiltrados: [],
  librosDisponiblesFiltrados: [],

  inicializar: async () => {
    const settings = await settingsService.getAll()
    const { limiteDeDias } = settings
    
    set({
      limiteDeDias: settings.limiteDeDias ?? 40,
      maximoLibrosEnPrestamo: settings.maximoLibrosEnPrestamo ?? 4,
    })

    const libros = await cargarLibrosEnPrestamo()
    const librosVencidos = libros.filter(
      l => l.fechaDePrestamo && calcularDiasDesdePrestamo(l.fechaDePrestamo) > limiteDeDias
    )
    set({ libros, librosVencidos, librosFiltrados: [] })
  },

  setMaximoLibrosEnPrestamo: (max) => {
    const { maximoLibrosEnPrestamo } = get()
    if(max <= 0) return maximoLibrosEnPrestamo
    
    set({ maximoLibrosEnPrestamo: max })
    settingsService.set('maximoLibrosEnPrestamo', max)
    return max
  },

  setLimiteDeDias: (limite: number) => {
    const { limiteDeDias } = get()
    if(limite <= 0) return limiteDeDias
    
    set({ limiteDeDias: limite })
    settingsService.set('limiteDeDias', limite)
    return limite
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

  buscarDisponibles: (query) => {
    const { libros } = get()

    if (!query.trim()) {
      set({ librosDisponiblesFiltrados: [] })
      return
    }
    
    const q = query.toLowerCase().trim()
    
    const disponibles = libros.filter(l => l.fechaDePrestamo === null)
    const filtrados = disponibles.filter(libro => {
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

    set({ librosDisponiblesFiltrados: ordenados })
  },

  getLibrosSocio: async (nombreSocio, nroSocio) => {
    const raw = await window.electronAPI.getLibrosPrestadosSocio(nombreSocio, nroSocio)
    return (raw as unknown[]).map(l => {
      const libro = l as Record<string, unknown>
      return {
        ...libro,
        fechaDePrestamo: libro.fechaDePrestamo ? new Date(libro.fechaDePrestamo as string) : null,
      }
    }) as LibroEnPrestamo[]
  },

  agregarLibroEnPrestamo: async (libro) => {
    const libroEnPrestamo = await window.electronAPI.addLibroPrestado(libro)
    if (!libroEnPrestamo) return null
    const { libros } = get()
    set({ libros: [...libros, libroEnPrestamo] })
    return libroEnPrestamo
  },

  devolverLibro: async (nroInventario) => {
    const ok = await window.electronAPI.devolverLibro(nroInventario)
    if (!ok) return
    const { libros } = get()
    set({ libros: libros.filter(l => l.numeroInventario !== nroInventario) })
  },

  getLibroPorInventario: (nroInventario) => {
    const { libros } = get()
    return libros.find(l => l.numeroInventario === nroInventario && l.fechaDePrestamo === null) ?? null
  },
}))
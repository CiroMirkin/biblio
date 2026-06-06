import { create } from "zustand"
import type { Libro, LibroEnPrestamo } from "@/models"
import { cargarLibrosEnPrestamo, settingsService } from "@/services"
import { calcularDiasDesdePrestamo, levenshtein } from "@/utils"

export type AreasDeBusqueda = "all" | "disponibles" | "prestados" | "vencidos"

interface LibrosState {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
  fechaDePrestamoAutomatica: boolean
  
  libros: LibroEnPrestamo[]

  librosFiltrados: LibroEnPrestamo[]

  librosVencidos: LibroEnPrestamo[]
  librosDisponibles: Libro[]
  librosPrestados: LibroEnPrestamo[]

  setMaximoLibrosEnPrestamo: (max: number) => number
  setLimiteDeDias: (limite: number) => number
  toggleFechaDePrestamoAutomatica: () => boolean

  inicializar: () => Promise<void>
  buscar: (query: string) => void
  getLibrosSocio: (nroSocio: number) => Promise<LibroEnPrestamo[]>
  agregarLibroEnPrestamo: (
    libro: Libro,
    options?: { fechaDePrestamo?: Date },
  ) => Promise<LibroEnPrestamo | null>

  devolverLibro: (nroInventario: number | string) => Promise<void>
  getLibroPorInventario: (nroInventario: number | string) => LibroEnPrestamo | null
}

export const useLibrosStore = create<LibrosState>((set, get) => ({
  limiteDeDias: 40,
  maximoLibrosEnPrestamo: 4,
  libros: [],
  librosVencidos: [],
  librosFiltrados: [],
  librosDisponibles: [],
  librosPrestados: [],
  fechaDePrestamoAutomatica: true,

  inicializar: async () => {
    const settings = await settingsService.getAll()
    const { limiteDeDias } = settings
    
    set({
      limiteDeDias: settings.limiteDeDias ?? 40,
      maximoLibrosEnPrestamo: settings.maximoLibrosEnPrestamo ?? 4,
      fechaDePrestamoAutomatica: settings.fechaDePrestamoAutomatica ?? true,
    })

    const librosVencidos: LibroEnPrestamo[] = [] 
    const librosDisponibles: Libro[] = []
    const librosPrestados: LibroEnPrestamo[] = []

    const libros = await cargarLibrosEnPrestamo()
    libros.forEach(libro => {
      if(libro.fechaDePrestamo === null) {
        librosDisponibles.push(libro)
      }
      else if(calcularDiasDesdePrestamo(libro.fechaDePrestamo) > limiteDeDias) {
        librosVencidos.push(libro)
      }
      else {
        librosPrestados.push(libro)
      }
    })
    const librosFiltrados = [...librosVencidos]

    set({ libros, librosVencidos, librosDisponibles, librosPrestados, librosFiltrados })
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

  toggleFechaDePrestamoAutomatica: () => {
    const { fechaDePrestamoAutomatica } = get()

    if(fechaDePrestamoAutomatica) {
      set({ fechaDePrestamoAutomatica: false })
      settingsService.set('fechaDePrestamoAutomatica', false)
      return false
    }

    set({ fechaDePrestamoAutomatica: true })
    settingsService.set('fechaDePrestamoAutomatica', true)
    return true
  },

  buscar: (query) => {
    const {
      libros,
      librosVencidos,
    } = get()

    if (!query.trim()) {
      set({ librosFiltrados: [...librosVencidos], })
      return
    }

    const q = query.toLowerCase().trim()

    const filtrados = libros.filter(libro => {

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

    set({ librosFiltrados: ordenados, })
  },

  getLibrosSocio: async (nroSocio) => {
    const raw = await window.electronAPI.getLibrosPrestadosSocio(nroSocio)
    return (raw as unknown[]).map(l => {
      const libro = l as Record<string, unknown>
      return {
        ...libro,
        fechaDePrestamo: libro.fechaDePrestamo ? new Date(libro.fechaDePrestamo as string) : null,
      }
    }) as LibroEnPrestamo[]
  },

  agregarLibroEnPrestamo: async (libro, { fechaDePrestamo } = {}) => {
    const libroEnPrestamo = await window.electronAPI.addLibroPrestado(libro, fechaDePrestamo)
    if (!libroEnPrestamo) return null
    const { libros } = get()
    set({ libros: [...libros, libroEnPrestamo] })
    return libroEnPrestamo
  },

  devolverLibro: async (nroInventario) => {
    const ok = await window.electronAPI.devolverLibro(nroInventario)
    if (!ok) return
    const { libros } = get()
    set({
      libros: libros.map(l =>
        l.numeroInventario !== nroInventario
          ? l
          : { ...l, fechaDePrestamo: null, nombreSocio: "", numeroSocio: null }
      )
    })
  },

  getLibroPorInventario: (nroInventario) => {
    const { libros } = get()

    const libro = libros.find(l => 
      l.numeroInventario?.toString() === nroInventario.toString().trim()
    ) ?? null

    return libro
  },
}))
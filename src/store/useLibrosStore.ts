import { create } from "zustand"
import type { Libro, LibroEnPrestamo } from "@/models"
import { cargarLibrosEnPrestamo } from "@/services"
import { calcularDiasDesdePrestamo } from "@/utils"
import { buscarLibro } from "./buscarLibro"
import { useSettingsStore } from "./useSettingsStore"

export type AreasDeBusqueda = "all" | "disponibles" | "prestados" | "vencidos"

interface LibrosState {
  showDetallesLibro: boolean
  libroSeleccionado: Libro | LibroEnPrestamo | null
  libros: LibroEnPrestamo[]
  librosFiltrados: LibroEnPrestamo[]
  librosVencidos: LibroEnPrestamo[]
  librosDisponibles: Libro[]
  librosPrestados: LibroEnPrestamo[]
  
  inicializar: () => Promise<void>
  
  verDetallesLibro: (libro: Libro | LibroEnPrestamo) => void
  editarLibro: (libro: Partial<LibroEnPrestamo>) => Promise<Libro | LibroEnPrestamo | null>
  
  verCatalogo: () => void
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
  libros: [],
  librosVencidos: [],
  librosFiltrados: [],
  librosDisponibles: [],
  librosPrestados: [],
  showDetallesLibro: false,
  libroSeleccionado: null,

  inicializar: async () => {
    const { limiteDeDias } = useSettingsStore.getState()

    const librosVencidos: LibroEnPrestamo[] = []
    const librosDisponibles: Libro[] = []
    const librosPrestados: LibroEnPrestamo[] = []

    const libros = await cargarLibrosEnPrestamo()
    libros.forEach(libro => {
      if (libro.fechaDePrestamo === null) {
        librosDisponibles.push(libro)
      }
      else if (calcularDiasDesdePrestamo(libro.fechaDePrestamo) > limiteDeDias) {
        librosVencidos.push(libro)
      }
      else {
        librosPrestados.push(libro)
      }
    })

    librosVencidos.sort((a, b) =>
      calcularDiasDesdePrestamo(b.fechaDePrestamo!) - calcularDiasDesdePrestamo(a.fechaDePrestamo!)
    )

    set({ libros, librosVencidos, librosDisponibles, librosPrestados, librosFiltrados: [...librosVencidos] })
  },

  buscar: (query) => {
    const { libros, librosVencidos } = get()

    if (!query.trim()) {
      set({ librosFiltrados: [...librosVencidos] })
      return
    }

    const filtrados = buscarLibro({
      libros,
      dato: query.toLowerCase().trim(),
    })
    set({ librosFiltrados: filtrados })
  },

  verCatalogo: () => set({ showDetallesLibro: false, }),

  verDetallesLibro: (libro) => {
    if(!libro) return;

    set({
      showDetallesLibro: true,
      libroSeleccionado: { ...libro },
    })
  },

  editarLibro: async (libro) => {
    if(!libro || !libro.numeroInventario) return null
    
    const updatedLibro = await window.electronAPI.editarDatosLibro(
      String(libro.numeroInventario),
      { ...libro }
    )
    
    if(!updatedLibro) return null
    
    const { libros, librosDisponibles, librosPrestados, librosVencidos } = get()
    set({
      libros: actualizarListaLibros(libros, updatedLibro as LibroEnPrestamo),
      librosDisponibles: actualizarListaLibros(librosDisponibles, updatedLibro as Libro),
      librosPrestados: actualizarListaLibros(librosPrestados, updatedLibro as LibroEnPrestamo),
      librosVencidos: actualizarListaLibros(librosVencidos, updatedLibro as LibroEnPrestamo),
    })
    return updatedLibro
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
    return libros.find(l =>
      l.numeroInventario?.toString() === nroInventario.toString().trim()
    ) ?? null
  },
}))

function actualizarListaLibros<T extends Libro>(libros: T[], updated: T): T[] {
  return libros.map(l => l.numeroInventario === updated.numeroInventario ? updated : l)
}
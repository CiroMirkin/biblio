import { create } from "zustand"
import type { Libro, LibroEnPrestamo, LibroRegistrado, Marc21 } from "@/models"
import { cargarLibrosEnPrestamo } from "@/services"
import { calcularDiasDesdePrestamo } from "@/utils"
import { buscarLibro } from "./buscarLibro"
import { useSettingsStore } from "./useSettingsStore"
import { buscarLibroPorNro } from "./buscarLibroPorNro"

export type AreasDeBusqueda = "all" | "disponibles" | "prestados" | "vencidos"

interface LibrosState {
  libros: LibroRegistrado[]
  librosFiltrados: LibroRegistrado[]
  librosVencidos: LibroRegistrado[]
  librosDisponibles: Libro[] | Marc21[]
  librosPrestados: LibroRegistrado[]
  
  showDetallesLibro: boolean
  libroSeleccionado: Libro | Marc21 |LibroRegistrado | null
  
  inicializar: () => Promise<void>
  
  verDetallesLibro: (libro: Libro | LibroRegistrado) => void
  editarLibro: (libro: Partial<LibroRegistrado>) => Promise<Libro | LibroRegistrado | null>
  
  verCatalogo: () => void
  buscar: (query: string) => void

  getLibrosSocio: (nroSocio: number) => Promise<LibroRegistrado[]>
  agregarLibroEnPrestamo: (
    libro: Libro | Marc21,
    options?: { fechaDePrestamo?: Date },
  ) => Promise<LibroRegistrado | null>
  devolverLibro: (nroInventario: number | string) => Promise<void>
  getLibroPorInventario: (nroInventario: number | string) => LibroRegistrado | null

  ingresoMark21: (ingreso: Marc21) => Promise<boolean>
  ingresoSimple: (ingreso: Libro) => Promise<boolean>
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

    const librosVencidos: LibroRegistrado[] = []
    const librosDisponibles: Libro[] = []
    const librosPrestados: LibroRegistrado[] = []

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
    
    const { libros, librosDisponibles, librosPrestados, librosVencidos, librosFiltrados } = get()
    set({
      libros: actualizarListaLibros(libros, updatedLibro as LibroRegistrado),
      librosDisponibles: actualizarListaLibros(librosDisponibles, updatedLibro as Libro),
      librosPrestados: actualizarListaLibros(librosPrestados, updatedLibro as LibroRegistrado),
      librosVencidos: actualizarListaLibros(librosVencidos, updatedLibro as LibroRegistrado),
      librosFiltrados: actualizarListaLibros(librosFiltrados, updatedLibro as LibroRegistrado),
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
    const result = buscarLibroPorNro(String(nroInventario), libros)
    return result.length ? result[0] : null
  },

  ingresoMark21: async (ingreso: Marc21) => {
    if (!ingreso.titulo?.trim() || !ingreso.itemType) return false
    if (!ingreso.holding.barcode || !ingreso.holding.homeBranch) return false

    const libroRegistrado = await window.electronAPI.ingresarLibroMark21(ingreso)
    if(!libroRegistrado) return false

    const { libros, librosDisponibles } = get()
    set({
      libros: [...libros, {
        ...libroRegistrado,
        fechaDePrestamo: null,
      }],
      librosDisponibles: [...librosDisponibles, libroRegistrado],
    })
    return true
  },

  ingresoSimple: async (ingreso: Libro) => {
    if(!ingreso.titulo.trim()) return false

    const libroRegistrado = await window.electronAPI.ingresarLibro(ingreso)
    if(!libroRegistrado) return false
    const newLibro = {
        ...libroRegistrado,
        fechaDePrestamo: null,
      }

    const { libros, librosDisponibles } = get()
    set({
      libros: [...libros, newLibro],
      librosDisponibles: [...librosDisponibles, newLibro ],
    })
    return true
  },
}))

function actualizarListaLibros<T extends Libro>(libros: T[], updated: T): T[] {
  return libros.map(l => l.numeroInventario === updated.numeroInventario ? updated : l)
}
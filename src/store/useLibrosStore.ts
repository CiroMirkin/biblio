import { create } from "zustand"
import type { DatosLibro, LibroRegistrado } from "@shared/models"
import { cargarLibrosEnPrestamo } from "@/services"
import { buscarLibroPorNro } from "./buscarLibroPorNro"

interface LibrosState {
  libros: LibroRegistrado[]
  query: string
  loadingLibros: boolean

  inicializar: () => Promise<void>

  editarLibro: (nroViejo: number | string | undefined, libro: Partial<DatosLibro>) => Promise<LibroRegistrado | null>

  buscar: (query: string) => void

  getLibrosSocio: (nroSocio: number) => Promise<LibroRegistrado[]>
  agregarLibroEnPrestamo: (
    libro: LibroRegistrado,
    options?: { fechaDePrestamo?: Date },
  ) => Promise<LibroRegistrado | null>
  devolverLibro: (nroInventario: number | string) => Promise<void>
  getLibroPorInventario: (nroInventario: number | string) => LibroRegistrado | null

  ingresarLibro: (ingreso: DatosLibro) => Promise<boolean>

  getUltimoNumeroInventario: () => number
  esNroInventarioExistente: (nro: string | number, options?: { nroActual?: string | number }) => { libro: LibroRegistrado | null, existente: boolean }
}

export const useLibrosStore = create<LibrosState>((set, get) => {
  const reemplazar = (updated: LibroRegistrado, nroViejo?: string) =>
    set({
      libros: reemplazarLibro(get().libros, updated, nroViejo)
    })

  return {
    libros: [],
    query: "",
    loadingLibros: true,

    inicializar: async () => {
      try {
        set({ libros: await cargarLibrosEnPrestamo() })
      }
      finally {
        set({ loadingLibros: false })
      }
    },

    buscar: (query) => set({ query }),

    editarLibro: async (nroViejo, libro) => {
      if(!libro || !libro.numeroInventario) return null

      const updatedLibro = await window.electronAPI.editarDatosLibro(String(nroViejo ?? ""), { ...libro })
      if(!updatedLibro) return null

      reemplazar(updatedLibro, String(nroViejo ?? ""))
      return updatedLibro
    },

    getLibrosSocio: async (nroSocio) => {
      const libros = await window.electronAPI.getLibrosPrestadosSocio(nroSocio)
      return libros || []
    },

    agregarLibroEnPrestamo: async (libro, { fechaDePrestamo } = {}) => {
      const libroPrestado = await window.electronAPI.addLibroPrestado(libro, fechaDePrestamo)
      if (!libroPrestado) return null

      reemplazar(libroPrestado)
      return libroPrestado
    },

    devolverLibro: async (nroInventario) => {
      const ok = await window.electronAPI.devolverLibro(nroInventario)
      if (!ok) return

      const libroEnPrestamo = get().libros.find(l => String(l.numeroInventario) === String(nroInventario))
      reemplazar({
        ...libroEnPrestamo,
        fechaDePrestamo: null,
        nombreSocio: "",
        numeroSocio: null,
      } as LibroRegistrado)
    },

    getLibroPorInventario: (nroInventario) => {
      const { libros } = get()
      const result = buscarLibroPorNro(String(nroInventario), libros)
      return result.length ? result[0] : null
    },

    ingresarLibro: async (ingreso: DatosLibro) => {
      const libroRegistrado = await window.electronAPI.ingresarLibro(ingreso)
      if(!libroRegistrado) return false

      reemplazar({ ...libroRegistrado, fechaDePrestamo: null })
      return true
    },

    getUltimoNumeroInventario: () => {
      const { libros } = get()
      if (!libros.length) return 0

      return libros.reduce((max, l) => {
        const n = Number(l.numeroInventario)
        return n > max ? n : max
      }, 0)
    },

    esNroInventarioExistente: (nro, options) => {
      if(nro === "" || nro === null || nro === undefined) {
        return {
          libro: null,
          existente: false,
        }
      }

      const libro = get().libros.find(l => String(l.numeroInventario) === String(nro)) ?? null
      return {
        libro,
        existente: libro !== null && String(nro) !== String(options?.nroActual),
      }
    },
  }
})

function reemplazarLibro(lista: LibroRegistrado[], updated: LibroRegistrado, nroViejo?: string): LibroRegistrado[] {
  const nro = nroViejo ?? String(updated.numeroInventario)
  const existe = lista.some(l => String(l.numeroInventario) === nro)
  return existe
    ? lista.map(l => String(l.numeroInventario) === nro ? updated : l)
    : [...lista, updated]
}

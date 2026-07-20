import { create } from "zustand"
import type { HistorialEntry, LibroRegistrado, Socio } from "@shared/models"
import * as historialService from "@/services/historialService"
import { useSociosStore } from "./useSociosStore"
import { useLibrosStore } from "./useLibrosStore"

type HistorialEntryConSocio = HistorialEntry & Socio
type HistorialEntryConLibro = HistorialEntry & LibroRegistrado

interface HistorialState {
  entriesConSocio: HistorialEntryConSocio[]
  entriesConLibro: HistorialEntryConLibro[]
  loading: boolean
  error: string | null

  buscarPorSocio: (nroSocio: number) => Promise<void>
  buscarPorLibro: (nroLibro: string) => Promise<void>
  eliminarAnio: (anio: number) => Promise<number>
  limpiarBusquedaEnHistorial: () => void
}

export const useHistorialStore = create<HistorialState>((set) => ({
  entriesConSocio: [],
  entriesConLibro: [],
  loading: false,
  error: null,

  buscarPorSocio: async (nroSocio) => {
    set({ loading: true, error: null })

    try {
      const entries = await historialService.getHistorialSocio(nroSocio)
      const libros = useLibrosStore.getState().libros
      const entriesConLibro: HistorialEntryConLibro[] = entries.map(e => {
        const libro = libros.find(l => String(l.numeroInventario) === e.nroLibro)
        return { ...e, ...libro } as HistorialEntryConLibro
      })

      set({ entriesConLibro, loading: false })
    }
    catch {
      set({ error: "Error al cargar historial del socio", loading: false })
    }
  },

  buscarPorLibro: async (nroLibro) => {
    set({ loading: true, error: null })

    try {
      const entries = await historialService.getHistorialLibro(nroLibro)
      const socios = useSociosStore.getState().socios
      const entriesConSocio: HistorialEntryConSocio[] = entries.map(e => {
        const socio = socios.find(s => s.nroSocio === e.nroSocio)
        if (!socio) throw new Error(`Socio no encontrado: ${e.nroSocio}`)
        return { ...e, ...socio }
      })

      set({ entriesConSocio, loading: false })
    }
    catch {
      set({ error: "Error al cargar historial del libro", loading: false })
    }
  },

  eliminarAnio: async (anio) => {
    set({ loading: true, error: null })

    try {
      const eliminadas = await historialService.eliminarHistorialAnio(anio)
      set({ loading: false })
      return eliminadas
    }
    catch {
      set({ error: "Error al eliminar historial", loading: false })
      return 0
    }
  },

  limpiarBusquedaEnHistorial: () => {
    set({
      entriesConSocio: [],
      entriesConLibro: [],
      error: null,
    })
  }
}))
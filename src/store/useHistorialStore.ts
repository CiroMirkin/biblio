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
  archivadoCargado: boolean
  loading: boolean
  error: string | null

  buscarPorSocio: (nroSocio: number, archivado?: boolean) => Promise<void>
  buscarPorLibro: (nroLibro: string, archivado?: boolean) => Promise<void>
}

export const useHistorialStore = create<HistorialState>((set) => ({
  entriesConSocio: [],
  entriesConLibro: [],
  archivadoCargado: false,
  loading: false,
  error: null,

  // lo archivado es más viejo que el historial actual, por eso va al final
  buscarPorSocio: async (nroSocio, archivado = false) => {
    set({ loading: true, error: null })

    try {
      const entries = await historialService.getHistorialSocio(nroSocio, archivado)
      const libros = useLibrosStore.getState().libros
      const entriesConLibro: HistorialEntryConLibro[] = entries.map(e => {
        const libro = libros.find(l => String(l.numeroInventario) === e.nroLibro)
        return { ...e, ...libro } as HistorialEntryConLibro
      }).reverse()

      set(s => ({
        entriesConLibro: archivado ? [...s.entriesConLibro, ...entriesConLibro] : entriesConLibro,
        archivadoCargado: archivado,
        loading: false,
      }))
    }
    catch {
      set({ error: "Error al cargar historial del socio", loading: false })
    }
  },

  buscarPorLibro: async (nroLibro, archivado = false) => {
    set({ loading: true, error: null })

    try {
      const entries = await historialService.getHistorialLibro(nroLibro, archivado)
      const socios = useSociosStore.getState().socios
      const entriesConSocio: HistorialEntryConSocio[] = entries.map(e => {
        const socio = socios.find(s => s.nroSocio === e.nroSocio)
        return { ...e, ...socio } as HistorialEntryConSocio
      }).reverse()

      set(s => ({
        entriesConSocio: archivado ? [...s.entriesConSocio, ...entriesConSocio] : entriesConSocio,
        archivadoCargado: archivado,
        loading: false,
      }))
    }
    catch {
      set({ error: "Error al cargar historial del libro", loading: false })
    }
  },
}))

import type { LibroEnPrestamo } from "@/models"

export {}

declare global {
  interface Window {
    electronAPI: {
      getSocios: () => Promise<Record<string, unknown>[]>
      getLibros: () => Promise<LibroEnPrestamo[]>
      addLibroPrestado: (libro: Libro) => Promise<LibroEnPrestamo | null>
      devolverLibro: (numeroInventario: number) => Promise<boolean>
      getLibrosPrestadosSocio: (nombreSocio: string, nroSocio: number) => Promise<Libro[]>
      getCuotasSocio: (nroSocio: number, anio: number) => Promise<Record<string, boolean>[]>
      toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => Promise<boolean>
    }
  }
}
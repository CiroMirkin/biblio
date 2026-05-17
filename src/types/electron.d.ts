import type { Libro, LibroEnPrestamo } from "@/models"

export {}


declare global {
  type ArchivoKey = 'socios' | 'cuotas' | 'libros'
  interface Window {
    electronAPI: {
      getSocios: () => Promise<Record<string, unknown>[]>
      getLibros: () => Promise<LibroEnPrestamo[]>
      addLibroPrestado: (libro: Libro) => Promise<LibroEnPrestamo | null>
      devolverLibro: (numeroInventario: number) => Promise<boolean>
      getLibrosPrestadosSocio: (nombreSocio: string, nroSocio: number) => Promise<Libro[]>
      getCuotasSocio: (nroSocio: number, anio: number) => Promise<Record<string, boolean>[]>
      toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => Promise<boolean>
      copiarExcel: (key: ArchivoKey) => Promise<boolean>
    }
  }
}
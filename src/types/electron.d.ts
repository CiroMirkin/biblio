import type { Libro, LibroEnPrestamo, NewSocio, Socio } from "@/models"

export {}

type SettingsSchema = {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
  maximoDeCuotasAdeudadas: number
}

declare global {
  type ArchivoKey = 'socios' | 'cuotas' | 'libros'
  interface Window {
    electronAPI: {
      getSocios: () => Promise<Record<string, unknown>[]>
      getLibros: () => Promise<LibroEnPrestamo[]>
      
      addLibroPrestado: (libro: Libro, fecha?: Date) => Promise<LibroEnPrestamo | null>
      
      devolverLibro: (numeroInventario: number) => Promise<boolean>
      getLibrosPrestadosSocio: (nombreSocio: string, nroSocio: number) => Promise<Libro[]>
      getCuotasSocio: (nroSocio: number, anio: number) => Promise<Record<string, boolean>[]>
      toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => Promise<boolean>
      darDeBajaSocio: (nombreSocio: string) => Promise<boolean>
      reactivarSocio: (nombreSocio: string) => Promise<boolean>
      changeObservaciones: (observaciones: string, nombreSocio: string) => Promise<boolean>
      createSocio: (socio: NewSocio) => Promise<Socio>
      copiarExcel: (key: ArchivoKey) => Promise<boolean>
      settingsGetAll: () => Promise<SettingsSchema>
      settingsGet: <K extends keyof SettingsSchema>(key: K) => Promise<SettingsSchema[K]>
      settingsSet: <K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]) => Promise<void>
    }
  }
}
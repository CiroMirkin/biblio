import type { Libro, LibroEnPrestamo, NewSocio, Socio } from "@/models"

export {}

type SettingsSchema = {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
  maximoDeCuotasAdeudadas: number
  fechaDePrestamoAutomatica: boolean
  precioCuota: number
  gestionDeCuotas: boolean
}

declare global {
  type ArchivoKey = 'socios' | 'cuotas' | 'libros'
  type SocioConLibros = Pick<Socio, 'nombreYApellido' | 'nroSocio'>
  interface Window {
    electronAPI: {
      getSocios: () => Promise<Record<string, unknown>[]>
      getLibros: () => Promise<LibroEnPrestamo[]>
      
      addLibroPrestado: (libro: Libro, fecha?: Date) => Promise<LibroEnPrestamo | null>
      
      devolverLibro: (numeroInventario: number | string) => Promise<boolean>
      getLibrosPrestadosSocio: (nroSocio: number) => Promise<Libro[]>
      getSociosConLibros: () => Promise<SocioConLibros[]>

      editarDatosSocio: (nroSocio: number, datos: Partial<Socio>) => Promise<boolean>
      cambiarNombreSocio: (nroSocio: number, nombre: string) => Promise<boolean>
      getCuotasSocio: (nroSocio: number, anio?: number) => Promise<{
        meses: Record<string, boolean>[],
        anio: number
      }>
      
      toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => Promise<boolean>
      
      darDeBajaSocio: (nroSocio: number) => Promise<boolean>
      reactivarSocio: (nroSocio: number) => Promise<boolean>
      
      changeObservaciones: (observaciones: string, nroSocio: number) => Promise<boolean>
      
      createSocio: (socio: NewSocio) => Promise<Socio>
      copiarExcel: (key: ArchivoKey) => Promise<boolean>
      settingsGetAll: () => Promise<SettingsSchema>
      settingsGet: <K extends keyof SettingsSchema>(key: K) => Promise<SettingsSchema[K]>
      settingsSet: <K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]) => Promise<void>
    }
  }
}
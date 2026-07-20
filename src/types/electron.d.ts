import type { HistorialEntry, Libro, LibroEnPrestamo, LibroRegistrado, Marc21, NewSocio, Socio } from "@/models"
import type { Settings as SettingsSchema } from "@/services/settingsService"

export {}

export type ImportarMrcResult = {
  agregados: number
  actualizados: number
  sinCambios: number
  errores: MrcImportError[]
}

declare global {
  type ArchivoKey = 'socios' | 'cuotas' | 'libros' | 'completo'
  type PeriodoDeIngreso = 'hoy' | 'semana' | 'mes' | 'año' | 'todos'
  type SocioConLibros = Pick<Socio, 'nombreYApellido' | 'nroSocio'>
  interface Window {
    electronAPI: {
      getSocios: () => Promise<Record<string, unknown>[]>
      getLibros: () => Promise<LibroEnPrestamo[]>
      editarDatosLibro: (nroInventario: string, datos: Partial<Libro | LibroRegistrado>) => Promise<Libro | LibroEnPrestamo | null>
      ingresarLibro: (libro: Libro) => Promise<Libro | null>
      ingresarLibroMark21: (libro: Marc21) => Promise<Marc21 | null>

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

      vincularSocios: (socio1: Socio, socio2: Socio) => Promise<boolean>
      desvincularSocios: (socio1: Socio, socio2: Socio) => Promise<boolean>
      
      toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => Promise<boolean>
      
      darDeBajaSocio: (nroSocio: number) => Promise<boolean>
      reactivarSocio: (nroSocio: number) => Promise<boolean>
      
      changeObservaciones: (observaciones: string, nroSocio: number) => Promise<boolean>
      
      createSocio: (socio: NewSocio) => Promise<Socio>
      copiarExcel: (key: ArchivoKey) => Promise<boolean>
      exportarExcelCompleto: () => Promise<boolean>
      importarExcelCompleto: () => Promise<{ ok: boolean, message: string }>
      obtenerArchivoMrc: (excluirSinIsbn?: boolean, periodoDeIngreso?: PeriodoDeIngreso) => Promise<void>
      importarMrc: (filePath: string) => Promise<ImportarMrcResult>
      settingsGetAll: () => Promise<SettingsSchema>
      settingsGet: <K extends keyof SettingsSchema>(key: K) => Promise<SettingsSchema[K]>
      settingsSet: <K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]) => Promise<void>
      
      openExternal: (url: string) => Promise<void>

      getHistorialSocio: (nroSocio: number) => Promise<HistorialEntry[]>
      getHistorialLibro: (nroLibro: string) => Promise<HistorialEntry[]>
      eliminarHistorialAnio: (anio: number) => Promise<number>
    }
  }
}
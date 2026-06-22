
export type IdEnLibros = 'Código de Barras' | 'N° de Inventario'

export interface Settings {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
  maximoDeCuotasAdeudadas: number
  fechaDePrestamoAutomatica: boolean
  precioCuota: number
  gestionDeCuotas: boolean
  numerosDeInventarioExternos: boolean
  vincularSocios: boolean
  catalogacionSimple: boolean
  nombreBiblioteca: string
  tipoDeIdEnLibros: IdEnLibros
}

export async function getAll(): Promise<Settings> {
  return window.electronAPI.settingsGetAll()
}

export async function get<K extends keyof Settings>(key: K): Promise<Settings[K]> {
  return window.electronAPI.settingsGet(key)
}

export async function set<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
  return window.electronAPI.settingsSet(key, value)
}

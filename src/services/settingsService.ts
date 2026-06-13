
export interface Settings {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
  maximoDeCuotasAdeudadas: number
  fechaDePrestamoAutomatica: boolean
  precioCuota: number
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

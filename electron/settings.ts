import Store from 'electron-store'

interface SettingsSchema {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
  maximoDeCuotasAdeudadas: number
  fechaDePrestamoAutomatica: boolean
}

const store = new Store<SettingsSchema>({
  name: 'settings',
  schema: {
    limiteDeDias: { type: 'number', minimum: 1, maximum: 365 },
    maximoLibrosEnPrestamo: { type: 'number', minimum: 1, maximum: 20 },
    maximoDeCuotasAdeudadas: { type: 'number', minimum: 1, maximum: 12 },
    fechaDePrestamoAutomatica: { type: 'boolean' },
  },
  defaults: {
    limiteDeDias: 40,
    maximoLibrosEnPrestamo: 4,
    maximoDeCuotasAdeudadas: 6,
    fechaDePrestamoAutomatica: true,
  },
})

export function getAll(): SettingsSchema {
  return {
    limiteDeDias: store.get('limiteDeDias'),
    maximoLibrosEnPrestamo: store.get('maximoLibrosEnPrestamo'),
    maximoDeCuotasAdeudadas: store.get('maximoDeCuotasAdeudadas'),
    fechaDePrestamoAutomatica: store.get('fechaDePrestamoAutomatica'),
  }
}

export function get<K extends keyof SettingsSchema>(key: K): SettingsSchema[K] {
  return store.get(key) as SettingsSchema[K]
}

export function set<K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]): void {
  store.set(key, value)
}

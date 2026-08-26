import Store from 'electron-store'

export interface SettingsSchema {
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
  sugerirNuevosNumerosDeInventario: boolean
}

const store = new Store<SettingsSchema>({
  name: 'settings',
  schema: {
    limiteDeDias: { type: 'number', minimum: 1, maximum: 365 },
    maximoLibrosEnPrestamo: { type: 'number', minimum: 1, maximum: 20 },
    maximoDeCuotasAdeudadas: { type: 'number', minimum: 1, maximum: 12 },
    fechaDePrestamoAutomatica: { type: 'boolean' },
    precioCuota: { type: 'number', minimum: 1, maximum: 10000, },
    gestionDeCuotas: { type: 'boolean', },
    numerosDeInventarioExternos: { type: 'boolean', },
    vincularSocios: { type: 'boolean' },
    catalogacionSimple: { type: 'boolean' },
    nombreBiblioteca: { type: 'string', minLength: 6, maxLength: 40, },
    sugerirNuevosNumerosDeInventario: { type: 'boolean' },
  },
  defaults: {
    limiteDeDias: 40,
    maximoLibrosEnPrestamo: 4,
    maximoDeCuotasAdeudadas: 6,
    fechaDePrestamoAutomatica: true,
    precioCuota: 1000,
    gestionDeCuotas: true,
    numerosDeInventarioExternos: true,
    vincularSocios: false,
    catalogacionSimple: true,
    nombreBiblioteca: 'Biblioteca ...',
    sugerirNuevosNumerosDeInventario: true,
  },
})

export function getAll(): SettingsSchema {
  return {
    limiteDeDias: store.get('limiteDeDias'),
    maximoLibrosEnPrestamo: store.get('maximoLibrosEnPrestamo'),
    maximoDeCuotasAdeudadas: store.get('maximoDeCuotasAdeudadas'),
    fechaDePrestamoAutomatica: store.get('fechaDePrestamoAutomatica'),
    precioCuota: store.get('precioCuota'),
    gestionDeCuotas: store.get('gestionDeCuotas'),
    numerosDeInventarioExternos: store.get('numerosDeInventarioExternos'),
    vincularSocios: store.get('vincularSocios'),
    catalogacionSimple: store.get('catalogacionSimple'),
    nombreBiblioteca: store.get('nombreBiblioteca'),
    sugerirNuevosNumerosDeInventario: store.get('sugerirNuevosNumerosDeInventario'),
  }
}

export function get<K extends keyof SettingsSchema>(key: K): SettingsSchema[K] {
  return store.get(key) as SettingsSchema[K]
}

export function set<K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]): void {
  store.set(key, value)
}

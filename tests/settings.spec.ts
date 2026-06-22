import { describe, it, expect, beforeEach, vi } from 'vitest'

const { mockStoreInstance, mockStoreConstructor } = vi.hoisted(() => {
  const instance = { get: vi.fn(), set: vi.fn() }
  return {
    mockStoreInstance: instance,
    mockStoreConstructor: vi.fn(function () { return instance }),
  }
})

vi.mock('electron-store', () => ({
  default: mockStoreConstructor,
}))

const settings = await import('../electron/settings')

// Verifica que el constructor de electron-store se llamó con el schema y defaults correctos
it('Constructor de electron-store recibe schema y defaults correctos', () => {
  expect(mockStoreConstructor).toHaveBeenCalledWith({
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
      nombreBiblioteca: { type: 'string', minLength: 6, maxLength: 40, }
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
      nombreBiblioteca: 'Biblioteca ...'
    },
  })
})

describe('electron/settings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // getAll() construye el objeto con claves explícitas en vez de usar store.store
  it('getAll construye objeto con claves explícitas', () => {
    mockStoreInstance.get.mockImplementation((key: string) => {
      if (key === 'limiteDeDias') return 30
      if (key === 'maximoLibrosEnPrestamo') return 5
      if (key === 'maximoDeCuotasAdeudadas') return 3
      if (key === 'fechaDePrestamoAutomatica') return true
      if (key === 'precioCuota') return 1000
      if (key === 'gestionDeCuotas') return true
      if (key === 'numerosDeInventarioExternos') return true
      if (key === 'vincularSocios') return true
      if (key === 'catalogacionSimple') return false
      if (key === 'nombreBiblioteca') return 'Biblio Rural Juance'

      return undefined
    })

    const result = settings.getAll()
    expect(result).toEqual({
      limiteDeDias: 30,
      maximoLibrosEnPrestamo: 5,
      maximoDeCuotasAdeudadas: 3,
      fechaDePrestamoAutomatica: true,
      precioCuota: 1000,
      gestionDeCuotas: true,
      numerosDeInventarioExternos: true,
      vincularSocios: true,
      catalogacionSimple: false,
      nombreBiblioteca: 'Biblio Rural Juance'
    })
    expect(mockStoreInstance.get).toHaveBeenCalledWith('limiteDeDias')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('maximoLibrosEnPrestamo')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('maximoDeCuotasAdeudadas')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('fechaDePrestamoAutomatica')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('precioCuota')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('gestionDeCuotas')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('numerosDeInventarioExternos')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('vincularSocios')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('catalogacionSimple')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('nombreBiblioteca')
  })

  // get() delega en store.get(key) y retorna el valor del constructor por defecto
  it('get retorna valor de una clave', () => {
    mockStoreInstance.get.mockReturnValue(25)
    const result = settings.get('limiteDeDias')
    expect(result).toBe(25)
    expect(mockStoreInstance.get).toHaveBeenCalledWith('limiteDeDias')
  })

  // set() delega en store.set(key, value)
  it('set persiste valor de una clave', () => {
    settings.set('limiteDeDias', 50)
    expect(mockStoreInstance.set).toHaveBeenCalledWith('limiteDeDias', 50)
  })
})

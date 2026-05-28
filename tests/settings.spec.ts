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
    },
    defaults: {
      limiteDeDias: 40,
      maximoLibrosEnPrestamo: 4,
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
      return undefined
    })

    const result = settings.getAll()
    expect(result).toEqual({ limiteDeDias: 30, maximoLibrosEnPrestamo: 5 })
    expect(mockStoreInstance.get).toHaveBeenCalledWith('limiteDeDias')
    expect(mockStoreInstance.get).toHaveBeenCalledWith('maximoLibrosEnPrestamo')
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

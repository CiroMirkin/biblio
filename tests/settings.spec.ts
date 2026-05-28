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

it('creates the Store with correct schema and defaults', () => {
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

  it('getAll returns object with explicit keys from store.get', () => {
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

  it('get returns value for a given key', () => {
    mockStoreInstance.get.mockReturnValue(25)
    const result = settings.get('limiteDeDias')
    expect(result).toBe(25)
    expect(mockStoreInstance.get).toHaveBeenCalledWith('limiteDeDias')
  })

  it('set stores a value for a given key', () => {
    settings.set('limiteDeDias', 50)
    expect(mockStoreInstance.set).toHaveBeenCalledWith('limiteDeDias', 50)
  })
})

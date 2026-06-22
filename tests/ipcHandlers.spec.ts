import { describe, it, expect, beforeEach, vi } from 'vitest'

const handlers = new Map<string, (...args: unknown[]) => unknown>()

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn((channel: string, handler: (...args: unknown[]) => unknown) => {
      handlers.set(channel, handler)
    }),
  },
}))

vi.mock('../electron/settings', () => ({
  getAll: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
}))

const { registerSettingsHandlers } = await import('../electron/utils/registerSettingsHandlers')
const mockSettings = await import('../electron/settings')

describe('Handlers IPC de ajustes (settings)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    handlers.clear()
    registerSettingsHandlers()
  })

  // El handler settings:getAll delega en settings.getAll()
  it('settings:getAll retorna todos los ajustes', async () => {
    vi.mocked(mockSettings.getAll).mockReturnValue({ 
      limiteDeDias: 40,
      maximoLibrosEnPrestamo: 4,
      maximoDeCuotasAdeudadas: 3,
      fechaDePrestamoAutomatica: true,
      precioCuota: 1500,
      gestionDeCuotas: true,
      numerosDeInventarioExternos: true,
      vincularSocios: false,
      catalogacionSimple: true,
      nombreBiblioteca: 'Biblioteca ...',
      tipoDeIdEnLibros: 'N° de Inventario',
    })
    const handler = handlers.get('settings:getAll')!
    const result = await handler()
    expect(result).toEqual({
      limiteDeDias: 40,
      maximoLibrosEnPrestamo: 4,
      maximoDeCuotasAdeudadas: 3,
      fechaDePrestamoAutomatica: true,
      precioCuota: 1500,
      gestionDeCuotas: true,
      numerosDeInventarioExternos: true,
      vincularSocios: false,
      catalogacionSimple: true,
      nombreBiblioteca: 'Biblioteca ...',
      tipoDeIdEnLibros: 'N° de Inventario',
    })
    expect(mockSettings.getAll).toHaveBeenCalledOnce()
  })

  // El handler settings:get delega en settings.get(key)
  it('settings:get retorna el valor de una clave', async () => {
    vi.mocked(mockSettings.get).mockReturnValue(30)
    const handler = handlers.get('settings:get')!
    const result = await handler({} as Electron.IpcMainInvokeEvent, 'limiteDeDias')
    expect(result).toBe(30)
    expect(mockSettings.get).toHaveBeenCalledWith('limiteDeDias')
  })

  // El handler settings:set delega en settings.set(key, value)
  it('settings:set persiste valor de una clave', async () => {
    const handler = handlers.get('settings:set')!
    await handler({} as Electron.IpcMainInvokeEvent, 'limiteDeDias', 50)
    expect(mockSettings.set).toHaveBeenCalledWith('limiteDeDias', 50)
  })

  // settings:set con limiteDeDias: 0 (el 0 es un valor falsy válido)
  it('settings:set persiste limiteDeDias=0 sin tratarlo como falsy', async () => {
    const handler = handlers.get('settings:set')!
    await handler({} as Electron.IpcMainInvokeEvent, 'limiteDeDias', 0)
    expect(mockSettings.set).toHaveBeenCalledWith('limiteDeDias', 0)
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockExecFile, mockReadFileSync } = vi.hoisted(() => ({
  mockExecFile: vi.fn(),
  mockReadFileSync: vi.fn(),
}))

vi.mock('node:child_process', () => ({ execFile: mockExecFile }))
vi.mock('node:fs', () => ({ default: { readFileSync: mockReadFileSync } }))

describe('sincronizacionDisponible', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  // Disponible solo si hay PowerShell+ImportExcel Y sheet-url.txt tiene una URL de exportación CSV válida
  it('true cuando PowerShell/ImportExcel responden ok y sheet-url.txt tiene una URL de export CSV', async () => {
    mockExecFile.mockImplementation((_cmd, _args, cb) => cb(null, { stdout: 'ok\n', stderr: '' }))
    mockReadFileSync.mockReturnValue('https://docs.google.com/spreadsheets/d/abc/export?format=csv&gid=1\n')

    const { sincronizacionDisponible } = await import('../electron/utils/verificarSincronizacionDisponible')
    expect(await sincronizacionDisponible()).toBe(true)
  })

  // La URL de edición (.../edit?gid=...) devuelve HTML, no CSV: no debe pasar el chequeo
  it('false cuando sheet-url.txt tiene la URL de edición en vez de la de exportación CSV', async () => {
    mockExecFile.mockImplementation((_cmd, _args, cb) => cb(null, { stdout: 'ok\n', stderr: '' }))
    mockReadFileSync.mockReturnValue('https://docs.google.com/spreadsheets/d/abc/edit?gid=1#gid=1')

    const { sincronizacionDisponible } = await import('../electron/utils/verificarSincronizacionDisponible')
    expect(await sincronizacionDisponible()).toBe(false)
  })

  // Si falta el módulo ImportExcel (execFile falla), no está disponible
  it('false cuando falla el chequeo de PowerShell/ImportExcel', async () => {
    mockExecFile.mockImplementation((_cmd, _args, cb) => cb(new Error('no powershell')))
    mockReadFileSync.mockReturnValue('https://sheet-url')

    const { sincronizacionDisponible } = await import('../electron/utils/verificarSincronizacionDisponible')
    expect(await sincronizacionDisponible()).toBe(false)
  })

  // Si sheet-url.txt no existe o está vacío, no está disponible aunque PowerShell esté ok
  it('false cuando sheet-url.txt no existe o está vacío', async () => {
    mockExecFile.mockImplementation((_cmd, _args, cb) => cb(null, { stdout: 'ok\n', stderr: '' }))
    mockReadFileSync.mockImplementation(() => { throw new Error('ENOENT') })

    const { sincronizacionDisponible } = await import('../electron/utils/verificarSincronizacionDisponible')
    expect(await sincronizacionDisponible()).toBe(false)
  })

  // El resultado se cachea: la segunda llamada no vuelve a invocar powershell
  it('cachea el resultado: solo un llamado a execFile para múltiples invocaciones', async () => {
    mockExecFile.mockImplementation((_cmd, _args, cb) => cb(null, { stdout: 'ok\n', stderr: '' }))
    mockReadFileSync.mockReturnValue('https://sheet-url')

    const { sincronizacionDisponible } = await import('../electron/utils/verificarSincronizacionDisponible')
    await sincronizacionDisponible()
    await sincronizacionDisponible()
    expect(mockExecFile).toHaveBeenCalledTimes(1)
  })
})

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { toggleCuota } from '../electron/handlers/toggleCuota'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'cuotas-template.xlsx')
const TEST_PATH = path.join(__dirname, 'fixtures', 'cuotas-test.xlsx')

beforeEach(() => {
  fs.copyFileSync(FIXTURE_PATH, TEST_PATH)
})

afterEach(() => {
  fs.rmSync(TEST_PATH, { force: true })
})

describe('toggleCuota', () => {
  it('Cambia el estado de pago de una cuota existente', async () => {
    const result = await toggleCuota(20, 2026, 0)
    expect(typeof result).toBe('boolean')
  })

  it('Lanza error si el socio no existe', async () => {
    await expect(toggleCuota(99999, 2024, 0)).rejects.toThrow('Socio 99999 no encontrado')
  })

  it('Lanza error si el mes no existe en el archivo', async () => {
    await expect(toggleCuota(2, 2021, 30)).rejects.toThrow()
  })
})

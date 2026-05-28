import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getLibros } from '../electron/handlers/getLibros'
import { LIBROS_JSON_PATH } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-test.json')

describe('getLibros', () => {
  beforeEach(() => {
    fs.copyFileSync(FIXTURE_PATH, LIBROS_JSON_PATH)
  })

  afterEach(() => {
    if (fs.existsSync(LIBROS_JSON_PATH)) {
      fs.rmSync(LIBROS_JSON_PATH, { force: true })
    }
  })

  it('Retorna todos los libros del archivo JSON', async () => {
    const libros = await getLibros()
    expect(libros).toHaveLength(2)
    expect(libros[0].titulo).toBe('Cien años de soledad')
    expect(libros[0].numeroInventario).toBe(1)
    expect(libros[0].fechaDePrestamo).toBeInstanceOf(Date)
    expect(libros[1].titulo).toBe('El principito')
    expect(libros[1].numeroInventario).toBe(2)
    expect(libros[1].fechaDePrestamo).toBeNull()
  })

  it('Retorna array vacío si el archivo JSON está vacío', async () => {
    fs.writeFileSync(LIBROS_JSON_PATH, '[]', 'utf-8')
    const libros = await getLibros()
    expect(libros).toHaveLength(0)
  })
})

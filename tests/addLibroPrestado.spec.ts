import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { Libro } from '../electron/libro'
import { addLibroPrestado } from '../electron/handlers/addLibroPrestado'
import { LIBROS_JSON_PATH } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-test.json')

describe('addLibroPrestado', () => {
  beforeEach(() => {
    fs.copyFileSync(FIXTURE_PATH, LIBROS_JSON_PATH)
  })

  afterEach(() => {
    if (fs.existsSync(LIBROS_JSON_PATH)) {
      fs.rmSync(LIBROS_JSON_PATH, { force: true })
    }
  })

  it('Agrega un libro nuevo al archivo JSON', async () => {
    const nuevo: Libro = {
      titulo: 'Rayuela',
      autor: 'Julio Cortázar',
      numeroInventario: 99,
      nombreSocio: 'María García',
      numeroSocio: 200,
    }

    const result = await addLibroPrestado(nuevo)

    expect(result).not.toBeNull()
    expect(result!.titulo).toBe('Rayuela')
    expect(result!.fechaDePrestamo).toBeInstanceOf(Date)

    const raw = JSON.parse(fs.readFileSync(LIBROS_JSON_PATH, 'utf-8'))
    expect(raw).toHaveLength(3)
    expect(raw.find((l: { numeroInventario: number }) => l.numeroInventario === 99)).toBeDefined()
  })

  it('Actualiza un libro existente por numeroInventario', async () => {
    const actualizado: Libro = {
      titulo: 'Cien años de soledad (Edición especial)',
      autor: 'Gabriel García Márquez',
      numeroInventario: 1,
      nombreSocio: 'Pedro López',
      numeroSocio: 300,
    }

    const result = await addLibroPrestado(actualizado)

    expect(result).not.toBeNull()
    expect(result!.nombreSocio).toBe('Pedro López')

    const raw = JSON.parse(fs.readFileSync(LIBROS_JSON_PATH, 'utf-8'))
    expect(raw).toHaveLength(2)
    const libro = raw.find((l: { numeroInventario: number }) => l.numeroInventario === 1)
    expect(libro.nombreSocio).toBe('Pedro López')
    expect(libro.titulo).toBe('Cien años de soledad (Edición especial)')
    expect(libro.fechaDePrestamo).toBeTruthy()
  })
})

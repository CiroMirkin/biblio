import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { ingresarLibro } from '../electron/handlers/libros/ingresarLibro'
import { getLibros } from '../electron/handlers/libros/getLibros'
import { LIBROS_XLSX_PATH } from '../electron/constants'
import { holdingVacio } from '@shared/models'
import { getSedePorDefecto } from '../electron/settings'

vi.mock('../electron/settings', () => ({ getSedePorDefecto: vi.fn() }))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-template.xlsx')

describe('ingresarLibro (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(FIXTURE_PATH, LIBROS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(LIBROS_XLSX_PATH)) {
            fs.rmSync(LIBROS_XLSX_PATH, { force: true })
        }
    })

    it('Adjunta la sede de la biblioteca cuando el libro llega sin sede', async () => {
        vi.mocked(getSedePorDefecto).mockReturnValue('Biblioteca Popular')

        const result = await ingresarLibro({ numeroInventario: '301', titulo: 'Rayuela', holding: holdingVacio() })

        expect(result?.holding).toMatchObject({ homeBranch: 'Biblioteca Popular', holdingBranch: 'Biblioteca Popular' })
        const guardado = (await getLibros()).find(l => l.numeroInventario === '301')
        expect(guardado?.holding.homeBranch).toBe('Biblioteca Popular')
    }, 30000)

    it('Permite ingresar sin sede si la biblioteca no tiene nombre', async () => {
        vi.mocked(getSedePorDefecto).mockReturnValue('')

        const result = await ingresarLibro({ numeroInventario: '302', titulo: 'Ficciones', holding: holdingVacio() })

        expect(result).not.toBeNull()
        expect(result?.holding.homeBranch).toBe('')
    }, 30000)
})

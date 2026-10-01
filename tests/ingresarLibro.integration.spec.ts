import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { ingresarLibro } from '../electron/handlers/libros/ingresarLibro'
import { getLibros } from '../electron/handlers/libros/getLibros'
import { LIBROS_XLSX_PATH } from '../electron/constants'
import { holdingVacio, type Libro } from '@shared/models'
import { get, getSedePorDefecto } from '../electron/settings'

vi.mock('../electron/settings', () => ({ get: vi.fn(), getSedePorDefecto: vi.fn() }))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'libros-template.xlsx')

const usarModo = (modo: 'simple' | 'marc21', sede: string) => {
    vi.mocked(get).mockImplementation(((key: string) => key === 'catalogacionSimple' ? modo === 'simple' : undefined) as typeof get)
    vi.mocked(getSedePorDefecto).mockReturnValue(sede)
}

const libro = (datos: Partial<Libro>): Libro => ({ titulo: 'Rayuela', numeroInventario: '301', holding: holdingVacio(), ...datos })

const buscarGuardado = async (nro: string) => (await getLibros()).find(l => l.numeroInventario === nro)

describe('ingresarLibro (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(FIXTURE_PATH, LIBROS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(LIBROS_XLSX_PATH)) {
            fs.rmSync(LIBROS_XLSX_PATH, { force: true })
        }
    })

    describe.each(['simple', 'marc21'] as const)('reglas comunes en modo %s', (modo) => {
        beforeEach(() => usarModo(modo, 'Biblioteca Popular'))

        it('Rechaza un libro sin titulo sin modificar el archivo', async () => {
            const statBefore = fs.statSync(LIBROS_XLSX_PATH).mtimeMs

            expect(await ingresarLibro(libro({ titulo: '   ' }))).toBeNull()
            expect(fs.statSync(LIBROS_XLSX_PATH).mtimeMs).toBe(statBefore)
        })

        it('Rechaza un libro sin N° de inventario', async () => {
            expect(await ingresarLibro(libro({ numeroInventario: '' }))).toBeNull()
        })

        it('Rechaza un N° de inventario ya registrado', async () => {
            const workbook = new ExcelJS.Workbook()
            await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
            const nroExistente = String(workbook.getWorksheet('Hoja1')!.getRow(2).getCell(6).value)

            expect(await ingresarLibro(libro({ numeroInventario: nroExistente }))).toBeNull()
        }, 30000)

        it('Guarda el libro con fecha de ingreso y la sede de la biblioteca', async () => {
            const result = await ingresarLibro(libro({}))

            expect(result?.fechaDeIngreso).toBeInstanceOf(Date)
            expect(result?.holding).toMatchObject({ homeBranch: 'Biblioteca Popular', holdingBranch: 'Biblioteca Popular' })
            expect((await buscarGuardado('301'))?.holding.homeBranch).toBe('Biblioteca Popular')
        }, 30000)
    })

    describe('modo simple', () => {
        it('Permite ingresar sin sede si la biblioteca no tiene nombre', async () => {
            usarModo('simple', '')

            const result = await ingresarLibro(libro({}))

            expect(result?.holding.homeBranch).toBe('')
        }, 30000)

        it('No completa el itemType', async () => {
            usarModo('simple', 'Biblioteca Popular')

            await ingresarLibro(libro({}))

            expect((await buscarGuardado('301'))?.itemType).toBeUndefined()
        }, 30000)
    })

    describe('modo MARC 21', () => {
        it('Rechaza el libro si no hay sede', async () => {
            usarModo('marc21', '')

            expect(await ingresarLibro(libro({}))).toBeNull()
        })

        it('Completa el itemType con BK', async () => {
            usarModo('marc21', 'Biblioteca Popular')

            const result = await ingresarLibro(libro({}))

            expect(result?.itemType).toBe('BK')
            expect((await buscarGuardado('301'))?.itemType).toBe('BK')
        }, 30000)

        it('Respeta la sede y el itemType que trae el libro', async () => {
            usarModo('marc21', 'Biblioteca Popular')

            const result = await ingresarLibro(libro({ itemType: 'DVD', holding: { homeBranch: 'Central', holdingBranch: 'Deposito' } }))

            expect(result?.itemType).toBe('DVD')
            expect(result?.holding).toMatchObject({ homeBranch: 'Central', holdingBranch: 'Deposito' })
        }, 30000)
    })
})

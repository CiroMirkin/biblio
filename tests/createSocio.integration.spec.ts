import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { createSocio } from '../electron/handlers/socios/createSocio'
import { SOCIOS_XLSX_PATH, CUOTAS_XLSX_PATH } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SOCIOS_FIXTURE_PATH = path.join(__dirname, 'fixtures', 'socios-template.xlsx')
const CUOTAS_FIXTURE_PATH = path.join(__dirname, 'fixtures', 'cuotas-template.xlsx')

describe('createSocio (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(SOCIOS_FIXTURE_PATH, SOCIOS_XLSX_PATH)
        fs.copyFileSync(CUOTAS_FIXTURE_PATH, CUOTAS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(SOCIOS_XLSX_PATH)) fs.rmSync(SOCIOS_XLSX_PATH, { force: true })
        if (fs.existsSync(CUOTAS_XLSX_PATH)) fs.rmSync(CUOTAS_XLSX_PATH, { force: true })
    })

    it('Asigna el nroSocio correcto tomando el máximo del fixture, no el último registro', async () => {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')!

        let maxNroSocio = 0
        ws.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            const nro = Number(row.getCell(1).value)
            if (nro > maxNroSocio) maxNroSocio = nro
        })

        const socio = await createSocio({
            nombreYApellido: 'Test Insercion',
            domicilio: '',
            dni: 0,
            fechaNacimiento: '',
            telefono: null,
            caracterSocio: 'activo',
            fechaIngreso: null,
            fechaEgreso: null,
            observaciones: '',
            email: '',
            sociosVinculados: [],
        })

        expect(socio.nroSocio).toBe(maxNroSocio + 1)

        const workbook2 = new ExcelJS.Workbook()
        await workbook2.xlsx.readFile(SOCIOS_XLSX_PATH)
        const ws2 = workbook2.getWorksheet('Hoja1')!

        const newRow = ws2.getRow(ws2.lastRow!.number)
        expect(Number(newRow.getCell(1).value)).toBe(socio.nroSocio)
    }, 30000)

    it('Inserta un socio en el archivo con los datos minimos requeridos', async () => {
        const socio = await createSocio({
            nombreYApellido: 'Test, Insercion',
            domicilio: '',
            dni: 0,
            fechaNacimiento: '',
            telefono: '351000000',
            caracterSocio: '',
            fechaIngreso: null,
            fechaEgreso: null,
            observaciones: '',
            email: '',
            sociosVinculados: [],
        })

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')!

        let encontrado = false
        ws.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(row.getCell(1).value) === socio.nroSocio) {
                encontrado = true
                expect(row.getCell(2).value).toBe('Test, Insercion')
                expect(row.getCell(6).value).toBe('351000000')
            }
        })

        expect(encontrado).toBe(true)
    }, 30000)

    it('Inserta el socio en el archivo con los datos correctos', async () => {
        const socio = await createSocio({
            nombreYApellido: 'Test Insercion',
            domicilio: 'Calle Falsa 123',
            dni: 12345678,
            fechaNacimiento: '1990-01-01',
            telefono: '351000000',
            caracterSocio: 'activo',
            fechaIngreso: null,
            fechaEgreso: null,
            observaciones: 'obs test',
            email: 'test@test.com',
            sociosVinculados: [2, 4],
        })

        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
        const ws = workbook.getWorksheet('Hoja1')!

        let encontrado = false
        ws.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(row.getCell(1).value) === socio.nroSocio) {
                encontrado = true
                expect(row.getCell(2).value).toBe('Test Insercion')
                expect(row.getCell(3).value).toBe('Calle Falsa 123')
                expect(row.getCell(4).value).toBe(12345678)
                expect(row.getCell(6).value).toBe('351000000')
                expect(row.getCell(10).value).toBe('obs test')
                expect(row.getCell(11).value).toBe('test@test.com')
                expect(row.getCell(12).value).toBe('2-4')
            }
        })

        expect(encontrado).toBe(true)
    }, 30000)

    it('Inserta el socio en ambos archivos excel', async () => {
        const socio = await createSocio({
            nombreYApellido: 'Test Ambos Archivos',
            domicilio: '',
            dni: 0,
            fechaNacimiento: '',
            telefono: null,
            caracterSocio: 'activo',
            fechaIngreso: null,
            fechaEgreso: null,
            observaciones: '',
            email: '',
            sociosVinculados: [],
        })

        const sociosWorkbook = new ExcelJS.Workbook()
        await sociosWorkbook.xlsx.readFile(SOCIOS_XLSX_PATH)
        const sociosWs = sociosWorkbook.getWorksheet('Hoja1')!

        let encontradoEnSocios = false
        sociosWs.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(row.getCell(1).value) === socio.nroSocio) {
                encontradoEnSocios = true
                expect(row.getCell(2).value).toBe('Test Ambos Archivos')
            }
        })
        expect(encontradoEnSocios).toBe(true)

        const cuotasWorkbook = new ExcelJS.Workbook()
        await cuotasWorkbook.xlsx.readFile(CUOTAS_XLSX_PATH)
        const cuotasWs = cuotasWorkbook.getWorksheet('original')!

        let encontradoEnCuotas = false
        cuotasWs.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(row.getCell(3).value) === socio.nroSocio) {
                encontradoEnCuotas = true
                expect(row.getCell(4).value).toBe('Test Ambos Archivos')
            }
        })
        expect(encontradoEnCuotas).toBe(true)
    }, 30000)
})
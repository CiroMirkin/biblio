import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { SOCIOS_XLSX_PATH, CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH } from '../electron/constants'
import { rowToSocio } from '../electron/utils/excelhelpers'
import { cambiarNombreSocio } from '../electron/handlers/cambiarNombreSocio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SOCIOS_FIXTURE = path.join(__dirname, 'fixtures', 'socios-template.xlsx')
const CUOTAS_FIXTURE = path.join(__dirname, 'fixtures', 'cuotas-template.xlsx')
const LIBROS_FIXTURE = path.join(__dirname, 'fixtures', 'libros-template.xlsx')

const NRO_SOCIO = 9
const NOMBRE_ORIGINAL = 'Prueba,Julia'
const NOMBRE_NUEVO = 'Prueba,Julia Modificada'

describe('cambiarNombre (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(SOCIOS_FIXTURE, SOCIOS_XLSX_PATH)
        fs.copyFileSync(CUOTAS_FIXTURE, CUOTAS_XLSX_PATH)
        fs.copyFileSync(LIBROS_FIXTURE, LIBROS_XLSX_PATH)
    })

    afterEach(() => {
        for (const filePath of [SOCIOS_XLSX_PATH, CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH]) {
            if (fs.existsSync(filePath)) {
                fs.rmSync(filePath, { force: true })
            }
        }
    })

    it('Retorna true cuando el socio existe', async () => {
        const result = await cambiarNombreSocio(NRO_SOCIO, NOMBRE_NUEVO)
        expect(result).toBe(true)
    }, 30000)

    it('Retorna false y no modifica ningun archivo si el socio no existe', async () => {
        const statAntes = {
            socios: fs.statSync(SOCIOS_XLSX_PATH).mtimeMs,
            cuotas: fs.statSync(CUOTAS_XLSX_PATH).mtimeMs,
            libros: fs.statSync(LIBROS_XLSX_PATH).mtimeMs,
        }

        const result = await cambiarNombreSocio(999000001, NOMBRE_NUEVO)
        expect(result).toBe(false)

        expect(fs.statSync(SOCIOS_XLSX_PATH).mtimeMs).toBe(statAntes.socios)
        expect(fs.statSync(CUOTAS_XLSX_PATH).mtimeMs).toBe(statAntes.cuotas)
        expect(fs.statSync(LIBROS_XLSX_PATH).mtimeMs).toBe(statAntes.libros)
    }, 30000)

    it('Actualiza el nombre en socios y deja el resto de los campos intactos', async () => {
        const wbAntes = new ExcelJS.Workbook()
        await wbAntes.xlsx.readFile(SOCIOS_XLSX_PATH)
        let socioAntes: ReturnType<typeof rowToSocio> | undefined
        wbAntes.getWorksheet('Hoja1')!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (row.getCell(1).value === NRO_SOCIO) socioAntes = rowToSocio(row)
        })

        await cambiarNombreSocio(NRO_SOCIO, NOMBRE_NUEVO)

        const wbDespues = new ExcelJS.Workbook()
        await wbDespues.xlsx.readFile(SOCIOS_XLSX_PATH)
        let socioDespues: ReturnType<typeof rowToSocio> | undefined
        wbDespues.getWorksheet('Hoja1')!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (row.getCell(1).value === NRO_SOCIO) socioDespues = rowToSocio(row)
        })

        expect(socioDespues).toBeDefined()
        expect(socioDespues!.nombreYApellido).toBe(NOMBRE_NUEVO)
        expect(socioDespues!.nroSocio).toBe(socioAntes!.nroSocio)
        expect(socioDespues!.dni).toBe(socioAntes!.dni)
        expect(socioDespues!.email).toBe(socioAntes!.email)
        expect(socioDespues!.telefono).toBe(socioAntes!.telefono)
        expect(socioDespues!.domicilio).toBe(socioAntes!.domicilio)
        expect(socioDespues!.observaciones).toBe(socioAntes!.observaciones)
    }, 30000)

    it('Actualiza el nombre en cuotas y deja el nroSocio intacto', async () => {
        await cambiarNombreSocio(NRO_SOCIO, NOMBRE_NUEVO)

        const wb = new ExcelJS.Workbook()
        await wb.xlsx.readFile(CUOTAS_XLSX_PATH)
        const ws = wb.getWorksheet('original')!

        let nombreEncontrado: string | undefined
        let nroEncontrado: number | undefined

        ws.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(row.getCell(3).value) === NRO_SOCIO) {
                nroEncontrado = Number(row.getCell(3).value)
                nombreEncontrado = row.getCell(4).value as string
            }
        })

        expect(nroEncontrado).toBe(NRO_SOCIO)
        expect(nombreEncontrado).toBe(NOMBRE_NUEVO)
    }, 30000)

    it('Actualiza el nombre en libros solo en filas del socio y deja las demas intactas', async () => {
        const wbAntes = new ExcelJS.Workbook()
        await wbAntes.xlsx.readFile(LIBROS_XLSX_PATH)
        const otrasFilas: { nroInventario: string; nombreSocio: string | null }[] = []
        wbAntes.getWorksheet('Hoja1')!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(row.getCell(5).value) !== NRO_SOCIO) {
                const rawNombre = row.getCell(4).value
                otrasFilas.push({
                    nroInventario: String(row.getCell(3).value),
                    nombreSocio: rawNombre == null ? null : String(rawNombre),
                })
            }
        })

        await cambiarNombreSocio(NRO_SOCIO, NOMBRE_NUEVO)

        const wbDespues = new ExcelJS.Workbook()
        await wbDespues.xlsx.readFile(LIBROS_XLSX_PATH)

        wbDespues.getWorksheet('Hoja1')!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(row.getCell(5).value) === NRO_SOCIO) {
                expect(row.getCell(4).value).toBe(NOMBRE_NUEVO)
            } else {
                const fila = otrasFilas.find(f => f.nroInventario === String(row.getCell(3).value))
                if (fila) {
                    const rawNombre = row.getCell(4).value
                    const nombreActual = rawNombre == null ? null : String(rawNombre)
                    expect(nombreActual).toBe(fila.nombreSocio)
                }
            }
        })
    }, 30000)

    it('No modifica el nombre original en socios si se invoca con el mismo nombre', async () => {
        await cambiarNombreSocio(NRO_SOCIO, NOMBRE_ORIGINAL)

        const wb = new ExcelJS.Workbook()
        await wb.xlsx.readFile(SOCIOS_XLSX_PATH)
        let nombreEncontrado: string | undefined
        wb.getWorksheet('Hoja1')!.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (row.getCell(1).value === NRO_SOCIO) {
                nombreEncontrado = rowToSocio(row).nombreYApellido
            }
        })

        expect(nombreEncontrado).toBe(NOMBRE_ORIGINAL)
    }, 30000)
})
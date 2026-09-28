import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import ExcelJS from 'exceljs'
import { modificarArchivo, modificarHoja, leerHoja, vaciarCache } from '../electron/utils/hojaExcel'

const HOJA = 'Hoja1'
let dir: string
let archivo: string
let otroArchivo: string

async function escribirValor(xlsxPath: string, valor: number) {
    const wb = new ExcelJS.Workbook()
    wb.addWorksheet(HOJA).getCell('A1').value = valor
    await wb.xlsx.writeFile(xlsxPath)
}

async function leerValorDeDisco(xlsxPath: string) {
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.readFile(xlsxPath)
    return wb.getWorksheet(HOJA)!.getCell('A1').value
}

const leerValor = () => leerHoja(archivo, HOJA, ({ worksheet }) => worksheet.getCell('A1').value)

describe('hojaExcel (unit)', () => {
    beforeEach(async () => {
        vaciarCache()
        dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hojaExcel-'))
        archivo = path.join(dir, 'a.xlsx')
        otroArchivo = path.join(dir, 'b.xlsx')
        await escribirValor(archivo, 1)
        await escribirValor(otroArchivo, 1)
    })

    afterEach(() => {
        fs.rmSync(dir, { recursive: true, force: true })
    })

    it('Reusa el workbook en memoria si el archivo no cambió', async () => {
        const wb1 = await leerHoja(archivo, HOJA, ({ worksheet }) => worksheet.workbook)
        const wb2 = await leerHoja(archivo, HOJA, ({ worksheet }) => worksheet.workbook)
        expect(wb2).toBe(wb1)
    })

    it('Falla si la hoja no existe', async () => {
        await expect(leerHoja(archivo, 'noExiste', () => 'no debería llegar')).rejects.toThrow('noExiste')
    })

    it('Relee de disco si otro proceso modificó el archivo', async () => {
        expect(await leerValor()).toBe(1)
        await escribirValor(archivo, 12345)
        expect(await leerValor()).toBe(12345)
    })

    it('Serializa ediciones concurrentes sobre el mismo archivo', async () => {
        const incrementar = () => modificarHoja(archivo, HOJA, async ({ worksheet, writeWorkbook }) => {
            const celda = worksheet.getCell('A1')
            const actual = Number(celda.value)
            await new Promise(r => setTimeout(r, 10))
            celda.value = actual + 1
            await writeWorkbook()
        })

        await Promise.all([incrementar(), incrementar(), incrementar()])
        expect(await leerValorDeDisco(archivo)).toBe(4)
    })

    it('Descarta una mutación que no se guardó', async () => {
        await modificarHoja(archivo, HOJA, ({ worksheet }) => {
            worksheet.getCell('A1').value = 99
        })
        expect(await leerValor()).toBe(1)
    })

    it('Si el callback falla, corre una sola vez y descarta el caché', async () => {
        let ejecuciones = 0
        const fallar = modificarHoja(archivo, HOJA, ({ worksheet }) => {
            ejecuciones++
            worksheet.getCell('A1').value = 99
            throw new Error('boom')
        })

        await expect(fallar).rejects.toThrow('boom')
        expect(ejecuciones).toBe(1)
        expect(await leerValor()).toBe(1)
    })

    it('modificarArchivo espera a la edición pendiente y descarta el caché', async () => {
        const orden: string[] = []
        const edicion = modificarHoja(archivo, HOJA, async ({ worksheet, writeWorkbook }) => {
            await new Promise(r => setTimeout(r, 10))
            worksheet.getCell('A1').value = 2
            await writeWorkbook()
            orden.push('edicion')
        })
        const externo = modificarArchivo(archivo, async () => {
            orden.push('externo')
            await escribirValor(archivo, 7)
        })

        await Promise.all([edicion, externo])
        expect(orden).toEqual(['edicion', 'externo'])
        expect(await leerValor()).toBe(7)
    })

    it('Leer el mismo archivo dentro de una edición no se bloquea y ve los cambios sin guardar', async () => {
        const visto = await modificarHoja(archivo, HOJA, async ({ worksheet, writeWorkbook }) => {
            worksheet.getCell('A1').value = 5
            const valor = await leerValor()
            await writeWorkbook()
            return valor
        })
        expect(visto).toBe(5)
    }, 1000)

    it('Acceder a otro archivo dentro de una edición falla en vez de bloquearse', async () => {
        const anidado = modificarHoja(archivo, HOJA, () =>
            leerHoja(otroArchivo, HOJA, () => 'no debería llegar')
        )
        await expect(anidado).rejects.toThrow(/dentro de/)
    }, 1000)
})

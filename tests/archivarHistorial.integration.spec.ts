import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import ExcelJS from 'exceljs'
import { archivarAnioMasAntiguo, getEstadoHistorial } from '../electron/handlers/historial/archivarHistorial'
import { getHistorialSocio, actualizarNroLibroEnHistorial } from '../electron/handlers/historial'
import { HISTORIAL_ARCHIVADO_DIR, PRESTAMOS_HISTORIAL_XLSX_PATH } from '../electron/constants'

async function escribirHistorial(filas: unknown[][]) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('prestamos')
    worksheet.addRow(['idPrestamo', 'fechaPrestamo', 'fechaDevolucion', 'nroSocio', 'nroLibro'])
    worksheet.addRows(filas)
    await workbook.xlsx.writeFile(PRESTAMOS_HISTORIAL_XLSX_PATH)
}

const ids = (entries: { idPrestamo: string }[]) => entries.map(e => e.idPrestamo).sort()

describe('archivarAnioMasAntiguo (integration)', () => {
    beforeEach(async () => {
        await escribirHistorial([
            ['a', new Date(2019, 5, 1), new Date(2020, 1, 1), 1, '10'],
            ['b', new Date(2020, 5, 1), new Date(2020, 6, 1), 1, '11'],
            ['abierto', new Date(2019, 5, 1), null, 1, '12'],
            ['c', new Date(2021, 5, 1), new Date(2021, 6, 1), 1, '10'],
        ])
    })

    afterEach(() => {
        fs.rmSync(PRESTAMOS_HISTORIAL_XLSX_PATH, { force: true })
        fs.rmSync(HISTORIAL_ARCHIVADO_DIR, { recursive: true, force: true })
    })

    it('Mueve los devueltos del año de devolucion mas antiguo y deja los abiertos', async () => {
        expect(await getEstadoHistorial()).toMatchObject({ registros: 4, anio: 2020, cantidad: 2 })

        expect(await archivarAnioMasAntiguo()).toEqual({ anio: 2020, cantidad: 2 })

        expect(ids(await getHistorialSocio(1))).toEqual(['abierto', 'c'])
        expect(ids(await getHistorialSocio(1, true))).toEqual(['a', 'b'])
        expect(await getEstadoHistorial()).toMatchObject({ registros: 2, anio: 2021, cantidad: 1 })
    }, 30000)

    it('Agrega al archivo del año si ya existe y renumera tambien lo archivado', async () => {
        await archivarAnioMasAntiguo()
        await archivarAnioMasAntiguo()
        await escribirHistorial([['d', new Date(2019, 1, 1), new Date(2020, 2, 1), 1, '10']])
        await archivarAnioMasAntiguo()

        expect(ids(await getHistorialSocio(1, true))).toEqual(['a', 'b', 'c', 'd'])

        expect(await actualizarNroLibroEnHistorial('10', '99')).toBe('3')
        const archivados = await getHistorialSocio(1, true)
        expect(archivados.filter(e => e.nroLibro === '99').map(e => e.idPrestamo).sort()).toEqual(['a', 'c', 'd'])
    }, 30000)
})

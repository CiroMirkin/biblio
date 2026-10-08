import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'
import { LIBROS_XLSX_PATH, PRESTAMOS_HISTORIAL_XLSX_PATH, PRESTAMOS_XLSX_PATH } from '../../electron/constants'
import { rowToPrestamo, type Prestamo } from '../../electron/models/prestamo'
import { migrarPrestamos } from '../../electron/utils/migrarPrestamos'

const LIBROS_FIXTURE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'fixtures', 'libros-template.xlsx')

/** libros desde la fixture y prestamos.xlsx migrado desde ella, como al abrir la app */
export async function prepararLibrosYPrestamos() {
    fs.copyFileSync(LIBROS_FIXTURE, LIBROS_XLSX_PATH)
    fs.rmSync(PRESTAMOS_XLSX_PATH, { force: true })
    fs.rmSync(PRESTAMOS_HISTORIAL_XLSX_PATH, { force: true })
    await migrarPrestamos()
}

export function limpiarLibrosYPrestamos() {
    for (const archivo of [LIBROS_XLSX_PATH, PRESTAMOS_XLSX_PATH, PRESTAMOS_HISTORIAL_XLSX_PATH]) {
        fs.rmSync(archivo, { force: true })
    }
}

export async function leerPrestamosDeDisco(): Promise<Prestamo[]> {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(PRESTAMOS_XLSX_PATH)
    const prestamos: Prestamo[] = []
    workbook.getWorksheet('prestamos')!.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        prestamos.push(rowToPrestamo(row))
    })
    return prestamos
}

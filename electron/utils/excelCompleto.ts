import { dialog } from 'electron'
import ExcelJS from 'exceljs'
import fs from 'node:fs/promises'
import { CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH, PRESTAMOS_XLSX_PATH, SOCIOS_XLSX_PATH } from '../constants'
import { getAll, set, type SettingsSchema } from '../settings'
import { modificarArchivo, leerHoja } from './hojaExcel'
import { migrarPrestamos } from './migrarPrestamos'

const ARCHIVOS = {
    socios: { path: SOCIOS_XLSX_PATH, hojaOrigen: 'Hoja1', hojaDestino: 'socios' },
    cuotas: { path: CUOTAS_XLSX_PATH, hojaOrigen: 'original', hojaDestino: 'cuotas' },
    libros: { path: LIBROS_XLSX_PATH, hojaOrigen: 'Hoja1', hojaDestino: 'libros' },
    prestamos: { path: PRESTAMOS_XLSX_PATH, hojaOrigen: 'prestamos', hojaDestino: 'prestamos' },
} as const

const HOJA_AJUSTES = 'ajustes'

// las copias anteriores a prestamos.xlsx traen los préstamos dentro de la hoja libros
const HOJAS_OPCIONALES: string[] = [ARCHIVOS.prestamos.hojaDestino]

export const exportarExcelCompleto = async () => {
    const fecha = new Date().toLocaleDateString(
        'es-AR',
        { day: '2-digit', month: '2-digit', year: '2-digit' }
    ).replace(/\//g, '-')

    const { filePath, canceled } = await dialog.showSaveDialog({
        defaultPath: `BIBLIO_copia_completa_(${fecha}).xlsx`,
        filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    })

    if (canceled || !filePath) return false

    const destino = new ExcelJS.Workbook()

    for (const { path: origen, hojaOrigen, hojaDestino } of Object.values(ARCHIVOS)) {
        await leerHoja(origen, hojaOrigen, ({ worksheet }) => copiarHoja(destino, worksheet, hojaDestino))
    }

    crearHojaAjustes(destino, getAll())

    await destino.xlsx.writeFile(filePath)
    return true
}

export const importarExcelCompleto = async () => {
    const { filePaths, canceled } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Excel', extensions: ['xlsx'] }],
    })

    if (canceled || filePaths.length === 0) {
        return {
            ok: false,
            message: "",
        }
    }

    const origenWb = new ExcelJS.Workbook()
    await origenWb.xlsx.readFile(filePaths[0])

    const hojasFaltantes = [
        ...Object.values(ARCHIVOS).map(({ hojaDestino }) => hojaDestino),
        HOJA_AJUSTES,
    ].filter(hojaDestino => !HOJAS_OPCIONALES.includes(hojaDestino) && !origenWb.getWorksheet(hojaDestino))

    if (hojasFaltantes.length > 0) {
        const prural = hojasFaltantes.length === 1
        return {
            ok: false,
            message: `El archivo no tiene ${prural ? 'la hoja' : 'las hojas'}: ${hojasFaltantes.join(', ')}.`,
        }
    }

    for (const { path: destinoPath, hojaOrigen, hojaDestino } of Object.values(ARCHIVOS)) {
        const hoja = origenWb.getWorksheet(hojaDestino)
        if (!hoja) {
            await modificarArchivo(destinoPath, () => fs.rm(destinoPath, { force: true }))
            continue
        }

        const destinoWb = new ExcelJS.Workbook()
        copiarHoja(destinoWb, hoja, hojaOrigen)

        await modificarArchivo(destinoPath, () => destinoWb.xlsx.writeFile(destinoPath))
    }

    await migrarPrestamos()
    importarHojaAjustes(origenWb.getWorksheet(HOJA_AJUSTES)!)

    return {
        ok: true,
        message: "¡Importado exitosamente!"
    }
}

function copiarHoja(destino: ExcelJS.Workbook, hojaOrigen: ExcelJS.Worksheet, nombreHoja: string): void {
    const hojaDestino = destino.addWorksheet(nombreHoja)

    hojaDestino.columns = hojaOrigen.columns.map(col => ({
        width: col.width,
    }))

    hojaOrigen.eachRow({ includeEmpty: true }, (rowOrigen, rowIndex) => {
        const rowDestino = hojaDestino.getRow(rowIndex)
        rowOrigen.eachCell({ includeEmpty: true }, (cellOrigen, colIndex) => {
            const cellDestino = rowDestino.getCell(colIndex)
            cellDestino.value = cellOrigen.value
            cellDestino.style = cellOrigen.style
        })
        rowDestino.commit()
    })
}

function crearHojaAjustes(destino: ExcelJS.Workbook, ajustes: SettingsSchema): void {
    const hoja = destino.addWorksheet(HOJA_AJUSTES)

    hoja.columns = [
        { header: 'Parametro (1)', key: 'parametro', width: 30 },
        { header: 'Valor (2)', key: 'valor', width: 20 },
    ]

    for (const [parametro, valor] of Object.entries(ajustes)) {
        hoja.addRow({ parametro, valor })
    }
}

function importarHojaAjustes(hoja: ExcelJS.Worksheet): void {
    const ajustesActuales = getAll()

    hoja.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return

        const parametro = row.getCell(1).value
        const valor = row.getCell(2).value

        if (typeof parametro !== 'string') return
        if (!(parametro in ajustesActuales)) return

        set(parametro as keyof SettingsSchema, valor as never)
    })
}
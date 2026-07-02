import { dialog } from 'electron'
import ExcelJS from 'exceljs'
import { CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH, SOCIOS_XLSX_PATH } from '../constants'

const ARCHIVOS = {
    socios: { path: SOCIOS_XLSX_PATH, hojaOrigen: 'Hoja1', hojaDestino: 'socios' },
    cuotas: { path: CUOTAS_XLSX_PATH, hojaOrigen: 'original', hojaDestino: 'cuotas' },
    libros: { path: LIBROS_XLSX_PATH, hojaOrigen: 'Hoja1', hojaDestino: 'libros' },
} as const

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
        const origenWb = new ExcelJS.Workbook()
        await origenWb.xlsx.readFile(origen)

        const hoja = origenWb.getWorksheet(hojaOrigen)
        if (!hoja) continue

        copiarHoja(destino, hoja, hojaDestino)
    }

    await destino.xlsx.writeFile(filePath)
    return true
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
import ExcelJS from 'exceljs'
import { SOCIOS_XLSX_PATH, CUOTAS_XLSX_PATH, LIBROS_XLSX_PATH } from '../constants'
import { rowToSocio, writeSocio } from '../utils/excelhelpers'

export const cambiarNombreSocio = async (nroSocio: number, nuevoNombre: string): Promise<boolean> => {
    const sociosWorkbook = new ExcelJS.Workbook()
    await sociosWorkbook.xlsx.readFile(SOCIOS_XLSX_PATH)
    const sociosSheet = sociosWorkbook.getWorksheet('Hoja1')
    if (!sociosSheet) return false
    if(!nuevoNombre.trim() || !nroSocio) return false

    let found = false

    sociosSheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        const socio = rowToSocio(row)
        if (socio.nroSocio === nroSocio) {
            writeSocio(row, { ...socio, nombreYApellido: nuevoNombre })
            found = true
        }
    })

    if (!found) return false

    await sociosWorkbook.xlsx.writeFile(SOCIOS_XLSX_PATH)

    const cuotasWorkbook = new ExcelJS.Workbook()
    await cuotasWorkbook.xlsx.readFile(CUOTAS_XLSX_PATH)
    const cuotasSheet = cuotasWorkbook.getWorksheet('original')
    if (!cuotasSheet) return false

    cuotasSheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        if (Number(row.getCell(3).value) === nroSocio) {
            row.getCell(4).value = nuevoNombre
        }
    })

    await cuotasWorkbook.xlsx.writeFile(CUOTAS_XLSX_PATH)

    const librosWorkbook = new ExcelJS.Workbook()
    await librosWorkbook.xlsx.readFile(LIBROS_XLSX_PATH)
    const librosSheet = librosWorkbook.getWorksheet('Hoja1')
    if (!librosSheet) return false

    librosSheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        if (Number(row.getCell(5).value) === nroSocio) {
            row.getCell(4).value = nuevoNombre
        }
    })

    await librosWorkbook.xlsx.writeFile(LIBROS_XLSX_PATH)

    return true
}
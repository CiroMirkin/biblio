import ExcelJS from 'exceljs'
import { SOCIOS_XLSX_PATH } from '../constants'
import { rowToSocio, writeSocio } from '../utils/excelhelpers'
import type { Socio } from '../socio'

export const editarDatosSocio = async (nroSocio: number, datos: Partial<Socio>): Promise<boolean> => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
    const worksheet = workbook.getWorksheet('Hoja1')
    if (!worksheet) return false

    let found = false

    const {
        nroSocio: _,
        nombreYApellido: __,
        ...datosSeguros
    } = datos as Partial<Socio>

    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        const socio = rowToSocio(row)
        if (socio.nroSocio === nroSocio) {
            writeSocio(row, { ...socio, ...datosSeguros })
            found = true
        }
    })

    if (found) {
        await workbook.xlsx.writeFile(SOCIOS_XLSX_PATH)
    }

    return found
}
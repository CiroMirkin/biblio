import ExcelJS from 'exceljs'
import { SOCIOS_XLSX_PATH } from '../constants'
import { rowToSocio, writeSocio } from '../utils/excelhelpers'

export const reactivarSocio = async (nroSocio: number): Promise<boolean> => {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
    const worksheet = workbook.getWorksheet('Hoja1')
    if (!worksheet) return false

    let found = false

    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        
        const socio = rowToSocio(row)
        if (socio.nroSocio === nroSocio) {
            writeSocio(row, { ...socio, caracterSocio: 'Regular' })
            found = true
        }
    })

    if (found) await workbook.xlsx.writeFile(SOCIOS_XLSX_PATH)
    return found
}
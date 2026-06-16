import ExcelJS from 'exceljs'
import { SOCIOS_XLSX_PATH } from '../constants'
import type { Socio } from '../socio'
import { editarDatosSocio } from './editarDatosSocio'

export const vincularSocios = async (socio1: Socio, socio2: Socio): Promise<boolean> => {
    if(!socio1.nroSocio || !socio2.nroSocio) return false

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(SOCIOS_XLSX_PATH)
    const worksheet = workbook.getWorksheet('Hoja1')
    if (!worksheet) return false

    const newSocio1: Socio = {
        ...socio1,
        sociosVinculados: [...socio1.sociosVinculados, socio2.nroSocio]
    }

    const newSocio2: Socio = {
        ...socio2,
        sociosVinculados: [...socio2.sociosVinculados, socio1.nroSocio]
    }

    // Se ejecutan secuencialmente para minimizar para evitar la posibilidad de un bloque de recursos
    // TODO: crear una funcion que permite editar los datos de varios socios
    const response1 = await editarDatosSocio(socio1.nroSocio, newSocio1)
    const response2 = await editarDatosSocio(socio2.nroSocio, newSocio2)

    return response1 && response2
}
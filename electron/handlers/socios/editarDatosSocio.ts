import { getSociosWorksheet } from '../../constants'
import { rowToSocio } from '../../models/socio'
import { writeSocio } from '../../models/socio'
import type { Socio } from '@shared/models/socio'

export const editarDatosSocio = async (nroSocio: number, datos: Partial<Socio>): Promise<boolean> => {
    const { worksheet, writeWorkbook } = await getSociosWorksheet()
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
        await writeWorkbook()
    }

    return found
}
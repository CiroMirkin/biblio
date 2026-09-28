import { modificarSocios } from '../../utils/datosExcel'
import { rowToSocio } from '../../models/socio'
import { writeSocio } from '../../models/socio'

export const darDeBajaSocio = async (nroSocio: number): Promise<boolean> => modificarSocios(async ({ worksheet, writeWorkbook }) => {
    if (!worksheet) return false

    let found = false

    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        
        const socio = rowToSocio(row)
        if (socio.nroSocio === nroSocio) {
            writeSocio(row, { ...socio, caracterSocio: 'Inactivo' })
            found = true
        }
    })

    if (found) await writeWorkbook()
    return found
})

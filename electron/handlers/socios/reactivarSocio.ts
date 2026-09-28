import { modificarSocios } from '../../utils/datosExcel'
import { rowToSocio } from '../../models/socio'
import { writeSocio } from '../../models/socio'

export const reactivarSocio = async (nroSocio: number): Promise<boolean> => modificarSocios(async ({ worksheet, writeWorkbook }) => {
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

    if (found) await writeWorkbook()
    return found
})

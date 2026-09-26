import { getSociosWorksheet, getCuotasWorksheet, getLibrosWorksheet } from '../../constants'
import { rowToSocio } from '../../models/socio'
import { writeSocio } from '../../models/socio'

export const cambiarNombreSocio = async (nroSocio: number, nuevoNombre: string): Promise<boolean> => {
    const { worksheet: sociosSheet, writeWorkbook: writeSocios } = await getSociosWorksheet()
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

    await writeSocios()

    const { worksheet: cuotasSheet, writeWorkbook: writeCuotas } = await getCuotasWorksheet()
    if (!cuotasSheet) return false

    cuotasSheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        if (Number(row.getCell(3).value) === nroSocio) {
            row.getCell(4).value = nuevoNombre
        }
    })

    await writeCuotas()

    const { worksheet: librosSheet, writeWorkbook: writeLibros } = await getLibrosWorksheet()
    if (!librosSheet) return false

    librosSheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        if (Number(row.getCell(2).value) === nroSocio) {
            row.getCell(1).value = nuevoNombre
        }
    })

    await writeLibros()

    return true
}
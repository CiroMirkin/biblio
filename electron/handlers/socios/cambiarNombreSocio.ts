import { modificarSocios, modificarCuotas, modificarLibros } from '../../utils/datosExcel'
import { rowToSocio } from '../../models/socio'
import { celdaCuotas } from '../../models/cuotas'
import { celdaLibro } from '../../models/libro'
import { writeSocio } from '../../models/socio'

export const cambiarNombreSocio = async (nroSocio: number, nuevoNombre: string): Promise<boolean> => {
    if(!nuevoNombre.trim() || !nroSocio) return false

    const sociosOk = await modificarSocios(async ({ worksheet: sociosSheet, writeWorkbook: writeSocios }) => {
        if (!sociosSheet) return false

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
        return true
    })
    if (!sociosOk) return false

    const cuotasOk = await modificarCuotas(async ({ worksheet: cuotasSheet, writeWorkbook: writeCuotas }) => {
        if (!cuotasSheet) return false

        cuotasSheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(celdaCuotas(row, 'nroSocio').value) === nroSocio) {
                celdaCuotas(row, 'nombre').value = nuevoNombre
            }
        })

        await writeCuotas()
        return true
    })
    if (!cuotasOk) return false

    return modificarLibros(async ({ worksheet: librosSheet, writeWorkbook: writeLibros }) => {
        if (!librosSheet) return false

        librosSheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(celdaLibro(row, 'numeroSocio').value) === nroSocio) {
                celdaLibro(row, 'nombreSocio').value = nuevoNombre
            }
        })

        await writeLibros()
        return true
    })
}

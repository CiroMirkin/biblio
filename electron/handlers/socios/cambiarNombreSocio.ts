import { modificarSocios, modificarCuotas, modificarPrestamos } from '../../utils/datosExcel'
import { rowToSocio } from '../../models/socio'
import { celdaCuotas } from '../../models/cuotas'
import { celdaPrestamo } from '../../models/prestamo'
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

    return modificarPrestamos(async ({ worksheet: prestamosSheet, writeWorkbook: writePrestamos }) => {
        if (!prestamosSheet) return false

        prestamosSheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (Number(celdaPrestamo(row, 'nroSocio').value) === nroSocio) {
                celdaPrestamo(row, 'nombreSocio').value = nuevoNombre
            }
        })

        await writePrestamos()
        return true
    })
}

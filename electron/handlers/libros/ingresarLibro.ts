import { modificarLibros } from "../../utils/datosExcel"
import { getNroDeInventarioFromRow, writeLibro } from "../../models/libro"
import { get, getSedePorDefecto } from "../../settings"
import { type Libro } from "@shared/models/libro"

/** Las reglas dependen del modo de catalogacion de los ajustes. Devuelve null si el libro no las cumple */
export const ingresarLibro = async (ingreso: Libro): Promise<Libro | null> => {
    const modoMarc = !get('catalogacionSimple')
    const numeroInventario = String(ingreso.numeroInventario ?? '').trim()
    const sede = ingreso.holding?.homeBranch || getSedePorDefecto()

    if (!ingreso.titulo?.trim() || !numeroInventario) return null
    if (modoMarc && !sede) return null

    return modificarLibros(async ({ worksheet, writeWorkbook }) => {
        let nroInventarioDuplicado = false
        worksheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            if (getNroDeInventarioFromRow(row) === numeroInventario) {
                nroInventarioDuplicado = true
            }
        })
        if (nroInventarioDuplicado) return null

        const newLibro: Libro = {
            ...ingreso,
            itemType: ingreso.itemType || (modoMarc ? 'BK' : undefined),
            fechaDeIngreso: new Date(),
            holding: {
                ...ingreso.holding,
                homeBranch: sede,
                holdingBranch: ingreso.holding?.holdingBranch || sede,
            },
        }
        writeLibro(worksheet.getRow(worksheet.rowCount + 1), newLibro)
        await writeWorkbook()
        return newLibro
    })
}

import { modificarLibros } from "../../utils/datosExcel"
import { getNroDeInventarioFromRow, writeLibro } from "../../models/libro"
import type { Libro } from "@shared/models/libro"

export const ingresarLibroMark21 = async (ingreso: Libro): Promise<Libro | null> => modificarLibros(async ({ worksheet, writeWorkbook }) => {
    let nroInventarioDuplicado = false
    const idLibro = ingreso.numeroInventario

    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        const nro = getNroDeInventarioFromRow(row)

        if (idLibro !== undefined && idLibro !== '' && nro === String(idLibro)) {
            nroInventarioDuplicado = true
        }
    })

    if (nroInventarioDuplicado) return null
    if (!String(ingreso.titulo || "").trim() || !ingreso.itemType) return null
    if (!ingreso.numeroInventario || !ingreso.holding.homeBranch) return null

    const targetRow = worksheet.getRow(worksheet.rowCount + 1)
    writeLibro(targetRow, {
        ...ingreso,
        fechaDeIngreso: new Date(),
    })
    await writeWorkbook()
    return ingreso
})

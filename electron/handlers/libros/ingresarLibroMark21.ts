import { getLibrosWorksheet } from "../../constants"
import { getNroDeInventarioFromRow, writeLibro } from "../../models/libro"
import type { Marc21 } from "@shared/models/marc21"

export const ingresarLibroMark21 = async (ingreso: Marc21): Promise<Marc21 | null> => {
    const { worksheet, writeWorkbook } = await getLibrosWorksheet()
    if (!worksheet) return null

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
    writeLibro(targetRow, ingreso)
    await writeWorkbook()
    return ingreso
}
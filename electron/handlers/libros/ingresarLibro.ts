import { getLibrosWorksheet } from "../../constants"
import { generarIdSinInventariar, getNroDeInventarioFromRow, writeLibro, type Libro } from "../../models/libro"

export const ingresarLibro = async (ingreso: Libro): Promise<Libro | null> => {
    const { worksheet, writeWorkbook } = await getLibrosWorksheet()
    if (!worksheet) return null

    let nroInventarioDuplicado = false
    const newNroInventario = ingreso.numeroInventario

    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        const nro = getNroDeInventarioFromRow(row)
        if (newNroInventario !== undefined && newNroInventario !== '' && nro === String(newNroInventario)) {
            nroInventarioDuplicado = true
        }
    })

    if (nroInventarioDuplicado) return null
    if (!ingreso.titulo?.trim()) return null

    const newLibro: Libro = {
        ...ingreso,
        titulo: ingreso.titulo,
        numeroInventario: ingreso.numeroInventario || generarIdSinInventariar(),
    }
    const targetRow = worksheet.getRow(worksheet.rowCount + 1)
    writeLibro(targetRow, newLibro)
    await writeWorkbook()
    return newLibro
}
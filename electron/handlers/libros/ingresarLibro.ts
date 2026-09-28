import { modificarLibros } from "../../utils/datosExcel"
import { generarIdSinInventariar, getNroDeInventarioFromRow, writeLibro } from "../../models/libro"
import { type Libro } from "@shared/models/libro"

export const ingresarLibro = async (ingreso: Libro): Promise<Libro | null> => modificarLibros(async ({ worksheet, writeWorkbook }) => {
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
        fechaDeIngreso: new Date(),
    }
    const targetRow = worksheet.getRow(worksheet.rowCount + 1)
    writeLibro(targetRow, newLibro)
    await writeWorkbook()
    return newLibro
})

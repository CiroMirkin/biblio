import ExcelJS from 'exceljs'
import { getLibrosWorksheet } from "../../constants"
import { generarIdSinInventariar, getNroDeInventarioFromRow, rowToLibro, writeLibro, type Libro, type LibroEnPrestamo } from "../../models/libro"

export const editarDatosLibro = async (nroInventario: number, datos: Partial<Libro>): Promise<Libro | null> => {
    const { worksheet, writeWorkbook } = await getLibrosWorksheet()
    if (!worksheet) return null

    let targetRow: ExcelJS.Row | null = null
    let nroInventarioDuplicado = false
    const {
        nombreSocio: _,
        numeroSocio: __,
        fechaDePrestamo: ___,
        ...nuevosDatos
    } = datos as Partial<LibroEnPrestamo>
    const newNroInventario = nuevosDatos.numeroInventario

    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        const nroFila = getNroDeInventarioFromRow(row)

        if (nroFila === String(nroInventario) && !targetRow) {
            targetRow = row
        }
        else if (newNroInventario !== undefined && newNroInventario !== '' && nroFila === String(newNroInventario)) {
            nroInventarioDuplicado = true
        }
    })

    if (!targetRow) return null
    if (nroInventarioDuplicado) return null

    const libroGuardadoActualmente = rowToLibro(targetRow)
    if (nuevosDatos.titulo === '' && libroGuardadoActualmente.titulo) return null

    const numeroInventarioFinal = 'numeroInventario' in nuevosDatos
        ? (nuevosDatos.numeroInventario || generarIdSinInventariar())
        : libroGuardadoActualmente.numeroInventario

    const newLibro = {
        ...libroGuardadoActualmente,
        ...nuevosDatos,
        numeroInventario: numeroInventarioFinal,
    }
    writeLibro(targetRow, newLibro)
    await writeWorkbook()
    return newLibro
}
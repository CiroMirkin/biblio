import ExcelJS from 'exceljs'
import { getLibrosWorksheet } from "../../constants"
import { generarIdSinInventariar, getNroDeInventarioFromRow, rowToLibro, writeLibro } from "../../models/libro"
import { type Libro, type LibroRegistrado } from "@shared/models/libro"
import { isMarc21 } from "@shared/models"
import { type Marc21 } from "@shared/models/marc21"

export const editarDatosLibro = async (nroInventario: number, datos: Partial<LibroRegistrado>): Promise<Libro | Marc21 | null> => {
    const { worksheet, writeWorkbook } = await getLibrosWorksheet()
    if (!worksheet) return null

    let targetRow: ExcelJS.Row | null = null
    const {
        nombreSocio: _,
        numeroSocio: __,
        fechaDePrestamo: ___,
        ...nuevosDatos
    } = datos as Partial<LibroRegistrado>

    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        const nro = getNroDeInventarioFromRow(row)

        if (nro === String(nroInventario) && !targetRow) {
            targetRow = row
        }
    })

    if (!targetRow) return null

    const libroGuardadoActualmente = rowToLibro(targetRow)
    if (nuevosDatos.titulo === '' && libroGuardadoActualmente.titulo) return null

    const numeroInventarioFinal = 'numeroInventario' in nuevosDatos
        ? (nuevosDatos.numeroInventario || generarIdSinInventariar())
        : libroGuardadoActualmente.numeroInventario

    let nroInventarioDuplicado = false  
    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        if (row.number === targetRow!.number) return 

        const nro = getNroDeInventarioFromRow(row)
        if (nro === String(numeroInventarioFinal)) {
            nroInventarioDuplicado = true
        }
    })
    if (nroInventarioDuplicado) return null

    const newLibro = {
        ...libroGuardadoActualmente,
        ...nuevosDatos,
        numeroInventario: numeroInventarioFinal,
    }

    if (isMarc21(newLibro)) {
        newLibro.holding = {
            ...newLibro.holding,
        }
    }

    writeLibro(targetRow, newLibro)
    await writeWorkbook()
    return newLibro
}
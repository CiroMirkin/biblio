import type ExcelJS from 'exceljs'
import { modificarLibros } from "../../utils/datosExcel"
import { generarIdSinInventariar, getNroDeInventarioFromRow, rowToLibro, writeLibro } from "../../models/libro"
import { type LibroRegistrado } from "@shared/models/libro"
import { actualizarNroLibroEnHistorial } from '../historial'

export const editarDatosLibro = async (nroInventario: number, datos: Partial<LibroRegistrado>): Promise<LibroRegistrado | null> => {
    const newLibro = await modificarLibros(async ({ worksheet, writeWorkbook }) => {
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

        writeLibro(targetRow, newLibro)
        await writeWorkbook()
        return newLibro
    })

    if (newLibro && String(nroInventario) !== String(newLibro.numeroInventario)) {
      await actualizarNroLibroEnHistorial(String(nroInventario), String(newLibro.numeroInventario))
    }

    return newLibro
}
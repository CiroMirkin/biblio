import { rowToLibro } from '../../models/libro'
import { type LibroRegistrado } from "@shared/models/libro"
import { leerLibros } from '../../constants'

export const getLibros = async (): Promise<LibroRegistrado[]> => leerLibros(({ worksheet }) => {
    if (!worksheet) return []

    const libros: LibroRegistrado[] = []
    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        libros.push(rowToLibro(row))
    })
    return libros
})

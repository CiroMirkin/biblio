import { rowToLibro } from '../../models/libro'
import { prestamoALibro, rowToPrestamo, type Prestamo } from '../../models/prestamo'
import { type Libro, type LibroRegistrado } from "@shared/models/libro"
import { leerLibros, leerPrestamos } from '../../utils/datosExcel'

/** Solo el catálogo, sin préstamos ni libros sin inventariar */
export const getCatalogo = async (): Promise<Libro[]> => leerLibros(({ worksheet }) => {
    const libros: Libro[] = []
    worksheet.eachRow((row, rowIndex) => {
        if (rowIndex === 1) return
        libros.push(rowToLibro(row))
    })
    return libros
})

/** El catálogo con el estado de préstamo de cada libro, más los préstamos de libros que no están en el catálogo */
export const getLibros = async (): Promise<LibroRegistrado[]> => {
    const prestamos = await leerPrestamos(({ worksheet }) => {
        const porLibro = new Map<string, Prestamo>()
        worksheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return
            const prestamo = rowToPrestamo(row)
            porLibro.set(prestamo.nroLibro, prestamo)
        })
        return porLibro
    })

    const libros: LibroRegistrado[] = (await getCatalogo()).map(libro => {
        const nro = String(libro.numeroInventario)
        const prestamo = prestamos.get(nro)
        prestamos.delete(nro)
        return {
            ...libro,
            nombreSocio: prestamo?.nombreSocio ?? '',
            numeroSocio: prestamo?.nroSocio ?? null,
            fechaDePrestamo: prestamo?.fechaPrestamo ?? null,
        }
    })

    return [...libros, ...[...prestamos.values()].map(prestamoALibro)]
}

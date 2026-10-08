import { leerPrestamos } from '../../utils/datosExcel'
import { prestamoALibro, rowToPrestamo } from '../../models/prestamo'
import { type LibroRegistrado } from "@shared/models/libro"

export const getLibrosPrestadosSocio = async (nroSocio: number) => leerPrestamos(({ worksheet }) => {
  const libros: LibroRegistrado[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    const prestamo = rowToPrestamo(row)
    if (Number(prestamo.nroSocio) === Number(nroSocio)) {
      libros.push(prestamoALibro(prestamo))
    }
  })

  return libros
})

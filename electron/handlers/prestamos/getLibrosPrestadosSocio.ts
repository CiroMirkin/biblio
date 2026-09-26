import { getLibrosWorksheet } from '../../constants'
import { rowToLibro } from '../../models/libro'
import { type Libro } from "@shared/models/libro"

export const getLibrosPrestadosSocio =  async (nroSocio: number) => {
  const { worksheet } = await getLibrosWorksheet()
  if (!worksheet) return []

  const libros: Libro[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    const libro = rowToLibro(row)
    if (Number(libro.numeroSocio) === Number(nroSocio)) {
      libros.push(libro)
    }
  })

  return libros
}

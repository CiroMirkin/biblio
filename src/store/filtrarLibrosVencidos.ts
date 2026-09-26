import type { LibroRegistrado } from "@shared/models"
import { calcularDiasDesdePrestamo } from "@/utils"

interface Params {
    libros: LibroRegistrado[]
    limiteDeDias: number
    order?: 'asc' | 'desc'
}

export const filtrarLibrosVencidos = ({ libros, limiteDeDias, order = 'desc', }: Params): LibroRegistrado[] => {
  const signo = order === 'desc' ? 1 : -1
  return libros
    .filter(libro => libro.fechaDePrestamo !== null && calcularDiasDesdePrestamo(libro.fechaDePrestamo) > limiteDeDias)
    .sort((a, b) => signo * (calcularDiasDesdePrestamo(b.fechaDePrestamo!) - calcularDiasDesdePrestamo(a.fechaDePrestamo!)))
}

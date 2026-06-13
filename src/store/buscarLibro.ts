import type { LibroEnPrestamo } from "@/models"
import { levenshtein, normailzarTexto } from "@/utils"

interface Params {
  libros: LibroEnPrestamo[]
  dato: string
}

export function buscarLibro({ libros, dato}: Params): LibroEnPrestamo[] {
  if (!isNaN(Number(dato))) {
    return libros.filter(s => Number(s.numeroInventario) === Number(dato))
  }

  const filtrados = libros.filter(libro => {
    const titulo = normailzarTexto(libro.titulo)
    if (titulo.includes(dato)) return true

    return titulo.split(" ").some(palabra => {
      if (palabra.startsWith(dato)) return true
      if (dato.length < 5) return false
      if (Math.abs(palabra.length - dato.length) > 1) return false
      return levenshtein(palabra, dato) <= 1
    })
  })

  const ordenados = filtrados.sort((a, b) => {
    const ta = a.titulo.toLowerCase()
    const tb = b.titulo.toLowerCase()
    
    if (ta === dato) return -1
    if (tb === dato) return 1
    
    if (ta.startsWith(dato) && !tb.startsWith(dato)) return -1
    if (tb.startsWith(dato) && !ta.startsWith(dato)) return 1
    
    return ta.localeCompare(tb, 'es', { sensitivity: 'base' })
  })

  if(ordenados.length) return ordenados

  return libros.filter(libro => normailzarTexto(libro.autor || '').includes(dato))
}

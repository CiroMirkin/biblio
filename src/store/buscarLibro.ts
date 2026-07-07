import type { LibroEnPrestamo, LibroRegistrado } from "@shared/models"
import { levenshtein, normailzarTexto } from "@/utils"
import { buscarLibroPorNro } from "./buscarLibroPorNro"

const dias = [ "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo" ]
const busquedaPorDiaKeys = dias.map(dia => `prestamos del ${dia}`)

interface Params {
  libros: LibroRegistrado[]
  dato: string
}

export function buscarLibro({ libros, dato }: Params): LibroRegistrado[] {
  dato = dato.toLocaleLowerCase().trim()
  
  if (dato === "prestamos de hoy") {
    return buscarLibrosDeHoy(libros)
  }

  if(dato === "ingresos de hoy") {
    return buscarLibrosRegistradosHoy(libros)
  }

  if(busquedaPorDiaKeys.includes(dato)) {
    return buscarLibrosDelDia(dato, libros)
  }

  if (!isNaN(Number(dato))) {
    return buscarLibroPorNro(dato, libros)
  }

  const porTitulo = buscarPorTitulo(libros, dato)
  const porAutor = buscarPorAutor(libros, dato)

  if (porTitulo.length === 0 && porAutor.length === 0) return []

  const [primero, segundo] = porAutor.length > porTitulo.length
    ? [porAutor, porTitulo]
    : [porTitulo, porAutor]

  return [...new Set([...primero, ...segundo])]
}

function buscarLibrosDeHoy(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  return libros.filter(
    libro => libro.fechaDePrestamo != null && esMismaFecha(libro.fechaDePrestamo, hoy)
  )
}

function buscarLibrosRegistradosHoy(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  return libros.filter(
    libro => libro.fechaDeIngreso != null && esMismaFecha(libro.fechaDeIngreso, hoy)
  )
}

function buscarLibrosDelDia(dato: string, libros: LibroRegistrado[]): LibroRegistrado[] {
  const dia = dato.split(' ')[2]
  const fechaBuscada = obtenerFechaDelDiaMasReciente(dia)

  return libros.filter(libro => {
    if(libro.fechaDePrestamo) {
      return esMismaFecha(libro.fechaDePrestamo, fechaBuscada)
    } 
  })
}

function obtenerFechaDelDiaMasReciente(nombreDia: string): Date {
  const hoy = new Date()
  const diaHoyIndex = (hoy.getDay() + 6) % 7
  const diaBuscadoIndex = dias.indexOf(nombreDia)
  const diferencia = (diaHoyIndex - diaBuscadoIndex + 7) % 7

  const fecha = new Date(hoy)
  fecha.setDate(hoy.getDate() - diferencia)
  return fecha
}

function esMismaFecha(fecha: Date, otra: Date): boolean {
  return (
    fecha.getFullYear() === otra.getFullYear() &&
    fecha.getMonth() === otra.getMonth() &&
    fecha.getDate() === otra.getDate()
  )
}

function buscarPorTitulo(libros: LibroEnPrestamo[], dato: string): LibroEnPrestamo[] {
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

  return filtrados.sort((a, b) => {
    const ta = a.titulo.toLowerCase()
    const tb = b.titulo.toLowerCase()

    if (ta === dato) return -1
    if (tb === dato) return 1

    if (ta.startsWith(dato) && !tb.startsWith(dato)) return -1
    if (tb.startsWith(dato) && !ta.startsWith(dato)) return 1

    return ta.localeCompare(tb, 'es', { sensitivity: 'base' })
  })
}

function buscarPorAutor(libros: LibroRegistrado[], dato: string): LibroRegistrado[] {
  return libros.filter(libro => normailzarTexto(libro.autor || '').includes(dato))
}

import type { LibroRegistrado } from "@shared/models";
import { esMismaFecha } from "./esMismaFecha";

function hoy(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  return libros.filter(
    libro => libro.fechaDeIngreso != null && esMismaFecha(libro.fechaDeIngreso, hoy)
  )
}

function ultimaSemana(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  const haceUnaSemana = new Date(hoy)
  haceUnaSemana.setDate(hoy.getDate() - 7)

  return libros.filter(
    libro => libro.fechaDeIngreso != null && new Date(libro.fechaDeIngreso) >= haceUnaSemana && new Date(libro.fechaDeIngreso) <= hoy
  )
}

function ultimoMes(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  const haceUnMes = new Date(hoy)
  haceUnMes.setMonth(hoy.getMonth() - 1)

  return libros.filter(
    libro => libro.fechaDeIngreso != null && new Date(libro.fechaDeIngreso) >= haceUnMes && new Date(libro.fechaDeIngreso) <= hoy
  )
}

function ultimoAnio(libros: LibroRegistrado[]): LibroRegistrado[] {
  const hoy = new Date()
  const haceUnAnio = new Date(hoy)
  haceUnAnio.setFullYear(hoy.getFullYear() - 1)
  
  return libros.filter(
    libro => libro.fechaDeIngreso != null && new Date(libro.fechaDeIngreso) >= haceUnAnio && new Date(libro.fechaDeIngreso) <= hoy
  )
}

export const filtrarLibrosRegistrados = {
  hoy,
  ultimaSemana,
  ultimoMes,
  ultimoAnio,
}

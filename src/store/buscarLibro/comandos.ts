import type { LibroRegistrado } from "@shared/models"
import { buscarLibrosDeHoy } from "@/utils"
import { filtrarLibrosRegistrados, esMismaFecha } from "@shared/utils"
import { filtrarLibrosVencidos } from "../filtrarLibrosVencidos"
import { useSettingsStore } from "../useSettingsStore"

const dias = [ "lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo" ]
const busquedaPorDiaKeys = dias.map(dia => `prestamos del ${dia}`)

// Solo el guion del inicio activa un comando
export const esComando = (dato: string) => dato.trim().startsWith("-")

export function ejecutarComando(dato: string, libros: LibroRegistrado[]): LibroRegistrado[] {
  const comando = dato.toLocaleLowerCase().trim().replace(/^-\s*/, "")

  if (comando === "prestamos de hoy") {
    return buscarLibrosDeHoy(libros)
  }

  if (comando === "ingresos de hoy") {
    return filtrarLibrosRegistrados.hoy(libros)
  }

  if (comando === "numeros de inventario repetidos") {
    return buscarNrosRepetidos(libros)
  }

  if (comando === "adeudados recientes") {
    return filtrarLibrosVencidos({
      libros,
      limiteDeDias: useSettingsStore.getState().limiteDeDias,
      order: 'asc',
    })
  }

  if (comando === "adeudados antiguos") {
    return filtrarLibrosVencidos({
      libros,
      limiteDeDias: useSettingsStore.getState().limiteDeDias,
      order: 'desc',
    })
  }

  if (busquedaPorDiaKeys.includes(comando)) {
    return buscarLibrosDelDia(comando, libros)
  }

  return []
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

function buscarNrosRepetidos(libros: LibroRegistrado[]): LibroRegistrado[] {
  const conteo = new Map<string, number>()

  libros.forEach(libro => {
    const nro = String(libro.numeroInventario)
    conteo.set(nro, (conteo.get(nro) ?? 0) + 1)
  })

  return libros
    .filter(libro => (conteo.get(String(libro.numeroInventario)) ?? 0) > 1)
    .sort((a, b) => String(a.numeroInventario).localeCompare(String(b.numeroInventario), 'es', { numeric: true }))
}

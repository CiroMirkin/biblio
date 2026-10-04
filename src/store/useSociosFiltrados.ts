import { useMemo } from "react"
import type { LibroRegistrado, Socio } from "@shared/models"
import { buscarSocio } from "./buscarSocio"
import { useSociosStore } from "./useSociosStore"
import { useLibrosStore } from "./useLibrosStore"

/** Para utilizarlo importa `useSociosFiltrados` */
export const filtrarSocios = (socios: Socio[], libros: LibroRegistrado[], query = "") => {
  const nrosConLibros = new Set(libros.map(l => Number(l.numeroSocio)).filter(Boolean))
  const sociosConLibros = socios.filter(s => nrosConLibros.has(Number(s.nroSocio)))

  const dato = query.toLowerCase().trim()
  const filtrados = dato
    ? buscarSocio({ dato, socios, libros })
    : sociosConLibros

  return {
    sociosConLibros,
    filtrados,
  }
}

export const useSociosFiltrados = () => {
  const socios = useSociosStore(s => s.socios)
  const query = useSociosStore(s => s.query)
  const libros = useLibrosStore(s => s.libros)
  return useMemo(() => (
    filtrarSocios(socios, libros, query)
  ), [socios, libros, query])
}

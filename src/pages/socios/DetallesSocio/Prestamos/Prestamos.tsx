import { useEffect, useState } from "react"
import { getCaracterSocio } from "@/models"
import { type LibroEnPrestamo } from "@shared/models"
import { formatName, formatTitulo } from "@/utils"
import { useSociosStore, useLibrosStore } from "@/store"
import { TablaPrestamos } from "./TablaPrestamos"
import { type InputLibro } from "./types"

interface Props {
  onSuccess: () => void
}

export function Prestamos({ onSuccess }: Props) {
  const { socioSeleccionado: socio } = useSociosStore()
  const {
    getLibrosSocio,
    agregarLibroEnPrestamo,
  } = useLibrosStore()

  const caracterSocio = getCaracterSocio(socio?.caracterSocio).estado
  const nombreSocio = socio!.nombreYApellido || ""
  const nroSocio = socio?.nroSocio

  // id cambia en cada carga para remontar la tabla con los datos nuevos
  const [carga, setCarga] = useState<{ id: number; libros: LibroEnPrestamo[] } | null>(null)

  useEffect(() => {
    if (!nroSocio) return
    getLibrosSocio(nroSocio).then(libros => {
      setCarga(prev => ({ id: (prev?.id ?? 0) + 1, libros }))
    })
  }, [nroSocio, nombreSocio, caracterSocio])

  async function registrar(inputs: InputLibro[]) {
    const registrados: Array<LibroEnPrestamo | null> = []

    for (const input of inputs) {
      const numeroInventario = isNaN(Number(input.numeroInventario.toString()))
        ? ""
        : input.numeroInventario

      const libro: LibroEnPrestamo = {
        autor: formatName(input.autor),
        titulo: formatTitulo(input.titulo),
        nombreSocio,
        numeroSocio: nroSocio ?? null,
        numeroInventario,
        fechaDePrestamo: null,
      }

      const fecha = input.fechaDePrestamo
        ? new Date(`${input.fechaDePrestamo}T10:30:45.789+00:00`)
        : undefined

      registrados.push(await agregarLibroEnPrestamo(libro, { fechaDePrestamo: fecha }))
    }

    if (registrados.some(Boolean)) onSuccess()
    return registrados
  }

  if (!carga) return null

  return (
    <TablaPrestamos
      key={carga.id}
      libros={carga.libros}
      disabled={!caracterSocio}
      onRegistrar={registrar}
    />
  )
}

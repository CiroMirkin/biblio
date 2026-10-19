import { useEffect, useRef } from "react"
import { useLibrosStore, useSettingsStore } from "@/store"
import { debeBuscar } from "@/store/buscarLibro"
import { Form } from "@/components"

// Espera a que se deje de escribir para no buscar con cada letra
const ESPERA_MS = 300

export function BuscarLibroForm() {
  const { buscar, query } = useLibrosStore()
  const { numerosDeInventarioExternos } = useSettingsStore()
  const espera = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(espera.current), [])

  const handleBusqueda = (nombreLibro: string) => {
    clearTimeout(espera.current)

    if (!nombreLibro.trim()) {
      buscar("")
      return
    }

    if (debeBuscar(nombreLibro)) {
      espera.current = setTimeout(() => buscar(nombreLibro), ESPERA_MS)
    }
  }

  const placeholder = numerosDeInventarioExternos
    ? "Nombre del libro, autor o N° de inventario"
    : "Nombre del libro o autor"

  return (
    <Form
      label="Buscar libro:"
      placeholder={placeholder}
      defaultValue={query}
      className="rounded p-4 card"
      onChange={handleBusqueda}
    />
  )
}

import { useLibrosStore, useSettingsStore } from "@/store"
import { Form } from "@/components"

export function BuscarLibroForm() {
  const { buscar } = useLibrosStore()
  const { numerosDeInventarioExternos } = useSettingsStore()

  const handleBusqueda = (nombreLibro: string) => {
    buscar(nombreLibro)
  }

  const placeholder = numerosDeInventarioExternos
    ? "Nombre del libro, autor o  N° de inventario"
    : "Nombre del libro o autor"

  return (
    <Form
      label="Buscar libro:"
      placeholder={placeholder}
      onChange={handleBusqueda}
    />
  )
}
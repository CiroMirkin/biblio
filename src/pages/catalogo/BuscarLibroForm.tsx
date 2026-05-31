import { useLibrosStore } from "@/store"
import { Form } from "@/components"

export function BuscarLibroForm() {
  const { buscar } = useLibrosStore()

  const handleBusqueda = (nombreLibro: string) => {
    buscar(nombreLibro)
  }

  return (
    <Form
      label="Buscar libro:"
      placeholder="Nombre del libro"
      onChange={handleBusqueda}
    />
  )
}
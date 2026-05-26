import { useLibrosStore } from "@/store"
import { Form } from "@/components"

export function BuscarLibroForm() {
  const { buscar, buscarDisponibles } = useLibrosStore()

  const handleBusqueda = (nombreLibro: string) => {
    buscar(nombreLibro)
    buscarDisponibles(nombreLibro)
  }

  return (
    <Form
      label="Buscar libro:"
      placeholder="Nombre del libro"
      onChange={handleBusqueda}
    />
  )
}
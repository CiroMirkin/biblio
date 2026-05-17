import { useLibrosStore } from "@/store"
import { Form } from "@/components"

export function BuscarLibroForm() {
  const { buscar } = useLibrosStore()

  return (
    <Form
      label="Buscar libro en préstamo:"
      placeholder="Nombre del libro"
      onChange={buscar}
    />
  )
}
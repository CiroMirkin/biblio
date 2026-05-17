import { useLibrosStore } from "@/store"
import { type ChangeEvent, type SyntheticEvent } from "react"

export function BuscarLibroForm() {
  const { buscar } = useLibrosStore()

  const handleSubmit = (e: SyntheticEvent) => e.preventDefault()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    buscar(e.target.value)
  }

  return (
    <form className="w-full rounded p-4" onSubmit={handleSubmit}>
      <label className="text-lg">Buscar libro en préstamo:</label>
      <div className="mt-1 w-full flex gap-2">
        <input
          type="text"
          onChange={handleChange}
          className="w-full border bg-white border-black rounded p-1 px-2"
          placeholder="Nombre del libro"
        />
        <input type="submit" value="Buscar" className="btn" />
      </div>
    </form>
  )
}
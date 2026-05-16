import { useState, type ChangeEvent, type ChangeEventHandler, type SyntheticEvent } from "react"
import { useSociosStore } from "../useSociosStore"

export function BuscarSocioForm() {
  const { buscar } = useSociosStore()
  const [apellido, setApellido] = useState('')

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    buscar(apellido)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApellido(e.target.value)
    buscar(apellido)
  }

  return (
    <form className="w-full rounded p-4" onSubmit={handleSubmit}>
      <label className="text-lg">Buscar socio:</label>
      <div className="mt-1 w-full flex gap-2">
        <input
          type="text"
          value={apellido}
          onChange={handleChange}
          className="w-full border bg-white border-black rounded p-1 px-2"
          placeholder="Apellido del socio"
        />
        <input type="submit" value="Buscar" className="btn" />
      </div>
    </form>
  )
}
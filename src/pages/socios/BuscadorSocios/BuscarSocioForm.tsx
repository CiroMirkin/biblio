import { useState, type ChangeEvent, type SyntheticEvent } from "react"
import { useSociosStore } from "@/store"

const SESSION_KEY = "buscar-socio-apellido"

export function BuscarSocioForm() {
  const { buscar } = useSociosStore()
  const [apellido, setApellido] = useState(() => sessionStorage.getItem(SESSION_KEY) ?? '')

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    buscar(apellido, {
      showDetallesSocio: false,
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApellido(e.target.value)
    sessionStorage.setItem(SESSION_KEY, e.target.value)
    buscar(e.target.value, {
      showDetallesSocio: false,
    })
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
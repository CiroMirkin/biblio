import { useState, type SyntheticEvent } from "react"

interface Props {
  onSearch: (apellido: string) => void
}

export function BuscarSocioForm({ onSearch }: Props) {
  const [apellido, setApellido] = useState('')

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    onSearch(apellido)
  }

  return (
    <form className="w-full rounded p-4 mb-2" onSubmit={handleSubmit}>
      <label className="text-lg">Buscar socio:</label>
      <div className="mt-1 w-full flex gap-2">
        <input
          type="text"
          value={apellido}
          onChange={e => setApellido(e.target.value)}
          className="w-full border bg-white border-black rounded p-1 px-2"
          placeholder="Apellido del socio"
        />
        <input type="submit" value="Buscar" className="btn" />
      </div>
    </form>
  )
}
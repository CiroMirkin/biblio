import { useEffect, useState } from "react"
import type { Libro } from "@/models"

interface Props {
  nombreSocio: string
  nroSocio?: number
}

export function Prestamos({ nombreSocio, nroSocio }: Props) {
  const [libros, setLibros] = useState<Libro[]>([])

  useEffect(() => {
    if (!nroSocio) return
    window.electronAPI.getLibrosPrestadosSocio(nombreSocio, nroSocio).then(setLibros)
  }, [nroSocio, nombreSocio])

  return (
    <form className="w-full flex flex-col rounded">
      {libros.map((libro, index) => (
        <div
          key={libro.numeroInventario}
          className={`flex justify-between gap-2 rounded py-3 px-2 ${index % 2 === 0 ? "bg-gray-200" : "bg-white"}`}
        >
          <div className="text-lg flex gap-4">
            <span>{libro.titulo}</span>
            <span>N° {libro.numeroInventario}</span>
          </div>
          <button className="btn">Devuelto</button>
        </div>
      ))}
      <div className="flex gap-2 py-3 px-2 rounded bg-gray-200">
        <input type="text" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
        <input type="text" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
      </div>
      <div className="flex gap-2 py-3 px-2 rounded bg-white">
        <input type="text" className="w-full border bg-white border-black rounded p-1 px-2" placeholder="Titulo del libro" />
        <input type="text" className="border border-black bg-white rounded p-1 px-2" placeholder="N° de Inventario" />
      </div>
      <button className="bg-[#8cbfb3] mt-4 p-1 pb-2 text-lg rounded">Registrar préstamo</button>
    </form>
  )
}
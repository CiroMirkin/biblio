import { useState, useEffect, type SyntheticEvent } from "react"
import { ListaSocios } from "./ListaSocios"
import type { Socio } from "@/models/Socio"
import { cargarSocios } from "@/services/cargarSocios"
import { Prestamos } from "./Prestamos"
import { CalendarioCuotas } from "./CalendarioCuotas"
import { SocioDatos } from "./SocioDatos"

export function Socios() {
  const [lista, setLista] = useState(false)
  const [cuotas, setCuotas] = useState(false)
  const [socios, setSocios] = useState<Socio[]>([])
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(
    null
  )

  useEffect(() => {
    cargarSocios().then(setSocios).catch(console.error)
  }, [])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    setLista(true)
    setCuotas(false)
  }

  const handleSelect = (socio: Socio) => {
    setSocioSeleccionado(socio)
    setLista(false)
    setCuotas(true)
  }

  return (
    <>
      <div className="">
        <h2 className="mb-2 text-xl font-semibold">
          Gestión de cuotas y socios
        </h2>
        <main className="w-full grid grid-cols-[3.5fr_1.5fr] gap-4 pt-4">
          <div>
            <form
              className="flex gap-2 rounded pb-4 mb-2"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                className="w-full border bg-white border-black rounded p-1 px-2"
                placeholder="Apellido del socio"
              />
              <input type="submit" value="Buscar" className="btn" />
            </form>

            {lista && (
              <ListaSocios socios={socios} onSelect={handleSelect} />
            )}
          </div>
          {!cuotas && (
            <aside className="p-4 rounded bg-white text-base">
              <p>Dentro de esta sección puedes:</p>
              <ul className="pl-4 pt-1 ml-1 list-disc">
                <li>Buscar socios según su apellido,</li>
                <li>ver sus datos personales</li>
                <li>el estado de sus cuotas,</li>
                <li>el préstamo y devolución de libros,</li>
                <li>darlo de baja o reincribirlo.</li>
              </ul>
            </aside>
          )}
        </main>
      </div>

      {cuotas && (
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-8">
            <SocioDatos socio={socioSeleccionado} />

            <div className="flex flex-col gap-4 card">
              <h2 className="text-xl font-semibold">Libros en Préstamo</h2>
              <Prestamos />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white rounded">
              <h2 className="pb-4 text-xl">Cuotas 2026</h2>
              
              <CalendarioCuotas />
            </div>
            <div className="mt-2 flex gap-4 card">
              <button className="px-4 pb-1 rounded bg-sky-200">Dar de baja</button>
              <button className="px-4 pb-1 rounded bg-sky-200">Re inscribir</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

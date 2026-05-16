import { cn } from "@/utils"
import { useState } from "react"
import { useSociosStore } from "../useSociosStore"
import { Spinner } from "@/components"

type MesProps = {
  nombre: string
  pagado: boolean
  onToggle: () => void
}

function Mes({ nombre, pagado, onToggle }: MesProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await onToggle()
    setLoading(false)
  }

  return (
    <li className={cn(
      "px-3 pb-2 pt-1 rounded flex flex-col gap-2 justify-center",
      pagado ? "bg-green-300" : "bg-[#f582ae59]",
      loading && "opacity-60"
    )}>
      <span className="font-semibold text-lg text-center truncate">{nombre}</span>
      {pagado
        ? <button onClick={handleToggle} disabled={loading} className={cn(
          "px-4 pb-1 flex items-center justify-center gap-1.5 bg-white opacity-50 hover:opacity-100 rounded",
          loading && "btn-disabled"
        )}>
          {loading && <Spinner />}  Pago
        </button>
        : <button onClick={handleToggle} disabled={loading} className={cn(
          "flex items-center justify-center gap-1.5 btn",
          loading && "btn-disabled"
        )}>
          {loading && <Spinner />}
          <span className="truncate">Adeuda</span>
        </button>
      }
    </li>
  )
}

export function CalendarioCuotas() {
  const { mesesCuotas, anio, toggleMes, irAnioAnterior, irAnioSiguiente } = useSociosStore()
  const anioActual = new Date().getFullYear()

  return (
    <>
      <ul className="grid sm:grid-cols-3 grid-cols-2 gap-2">
        {mesesCuotas.map((mes, i) => {
          const [nombre, pagado] = Object.entries(mes)[0]
          return <Mes key={nombre} nombre={nombre} pagado={pagado} onToggle={() => toggleMes(i)} />
        })}
      </ul>

      <footer className="w-full pt-4 flex gap-6 justify-center items-center">
        <button onClick={irAnioAnterior} className="btn">
          {anio - 1}
        </button>
        <span className="font-semibold text-lg">{anio}</span>
        <button
          onClick={irAnioSiguiente}
          className={cn("btn", anio >= anioActual ? "opacity-35 pointer-events-none" : "")}
          disabled={anio >= anioActual}
        >
          {anio + 1}
        </button>
      </footer>
    </>
  )
}
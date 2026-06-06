import { cn } from "@/utils"
import { useState } from "react"
import { useSociosStore } from "@/store"
import { Spinner } from "@/components"

type MesProps = {
  nombre: string
  pagado: boolean
  loading: boolean
  anyLoading: boolean
  onToggle: () => void
  year: number
}

function Mes({ nombre, pagado, loading, anyLoading, onToggle, year }: MesProps) {
  return (
    <li onClick={!anyLoading ? onToggle : undefined} className={cn(
      "px-3 pb-2 pt-1 rounded flex flex-col gap-2 justify-center cursor-default shadow-xs select-none",
      pagado ? "bg-green" : "bg-[#f582ae59]",
      anyLoading && "opacity-80"
    )}>
      <div className="flex flex-col justify-center items-center">
        <span className="pt-px text-xs opacity-70 font-semibold">{year}</span>
        <span className="font-semibold text-lg text-center truncate">
          {nombre}
        </span>
      </div>
      {pagado
        ? <button disabled={loading} className={cn(
          "px-4 pb-1 flex items-center justify-center gap-1.5 bg-white opacity-50 hover:opacity-100 rounded",
          loading && "btn-disabled"
        )}>
          {loading && <Spinner />} Pago
        </button>
        : <button disabled={loading} className={cn(
          "flex items-center justify-center gap-1.5 btn bg-[#d9376d74]",
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
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null)
  const anioActual = new Date().getFullYear()

  const handleToggle = async (i: number) => {
    if (loadingIndex !== null) return
    setLoadingIndex(i)
    await toggleMes(i)
    setLoadingIndex(null)
  }

  return (
    <>
      <ul className="grid sm:grid-cols-3 grid-cols-2 gap-2">
        {mesesCuotas.map((mes, i) => {
          const [nombre, pagado] = Object.entries(mes)[0]
          return (
            <Mes
              key={nombre}
              year={anio}
              nombre={nombre}
              pagado={pagado}
              loading={loadingIndex === i}
              anyLoading={loadingIndex !== null}
              onToggle={() => handleToggle(i)}
            />
          )
        })}
      </ul>

      <footer className="w-full pt-4 flex gap-6 justify-center items-center">
        <button onClick={irAnioAnterior} disabled={loadingIndex !== null} className={cn("btn", loadingIndex !== null && "opacity-35 pointer-events-none")}>
          {anio - 1}
        </button>
        <span className="font-semibold text-lg opacity-70">{anio}</span>
        <button
          onClick={irAnioSiguiente}
          className={cn("btn", (anio >= anioActual || loadingIndex !== null) ? "opacity-35 pointer-events-none" : "")}
          disabled={anio >= anioActual || loadingIndex !== null}
        >
          {anio + 1}
        </button>
      </footer>
    </>
  )
}
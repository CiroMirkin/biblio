import { cn } from "@/utils"
import { useState } from "react"
import { useSociosStore } from "@/store"
import { Spinner, ChevronsLeftIcon, ChevronsRightICon } from "@/components"
import { AnimatePresence, motion } from "motion/react"

type MesProps = {
  nombre: string
  pagado: boolean
  gris: boolean
  loading: boolean
  anyLoading: boolean
  onToggle: () => void
  year: number
}

function Mes({ nombre, pagado, gris, loading, anyLoading, onToggle, year }: MesProps) {
  const color = pagado ? "bg-green" : "bg-[#f582ae59]"
  return (
    <li onClick={!anyLoading ? onToggle : undefined} className={cn(
      "px-3 pb-2 pt-1 rounded flex flex-col gap-2 justify-center cursor-default shadow-xs select-none w-0 min-w-full",
      gris ? "bg-gray" : color,
      anyLoading && "opacity-80"
    )}>
      <div className="flex flex-col justify-center items-center overflow-hidden w-full">
        <span className="pt-px text-xs opacity-70 font-semibold">{year}</span>
        <span className={cn("font-semibold text-lg text-center truncate w-full", gris && "opacity-80")}>
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
          "flex items-center justify-center gap-1.5 btn ",
          gris ? "opacity-0" : "bg-[#d9376d74]",
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

  const ultimoPagoIndex = mesesCuotas.reduce((last, mes, i) => {
    const pagado = Object.values(mes)[0]
    return pagado ? i : last
  }, -1)

  const handleToggle = async (i: number) => {
    if (loadingIndex !== null) return
    setLoadingIndex(i)
    await toggleMes(i)
    setLoadingIndex(null)
  }

  return (
    <>
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.ul
            key={anio}
            className="grid sm:grid-cols-3 grid-cols-2 gap-2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {mesesCuotas.map((mes, i) => {
              const [nombre, pagado] = Object.entries(mes)[0]
              const gris = anio === anioActual ? (!pagado && i < ultimoPagoIndex) : !pagado
              return (
                <Mes
                  key={nombre}
                  year={anio}
                  nombre={nombre}
                  pagado={pagado}
                  gris={gris}
                  loading={loadingIndex === i}
                  anyLoading={loadingIndex !== null}
                  onToggle={() => handleToggle(i)}
                />
              )
            })}
          </motion.ul>
        </AnimatePresence>
      </div>

      <footer className="w-full pt-4 flex gap-5 justify-center items-center">
        <button onClick={irAnioAnterior} disabled={loadingIndex !== null} className={cn("btn py-1", loadingIndex !== null && "opacity-35 pointer-events-none")}>
          <ChevronsLeftIcon />
        </button>
        <span
          className={cn("px-1.5 font-semibold text-lg opacity-70 rounded", anio !== anioActual && "bg-amber")}
        >
          {anio}
        </span>
        <button
          onClick={irAnioSiguiente}
          className={cn("btn py-1", (anio >= anioActual || loadingIndex !== null) ? "opacity-35 pointer-events-none" : "")}
          disabled={anio >= anioActual || loadingIndex !== null}
        >
          <ChevronsRightICon />
        </button>
      </footer>
    </>
  )
}
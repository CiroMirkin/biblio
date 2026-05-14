import type { Calendario } from "@/models"

type MesProps = {
  nombre: string
  pagado: boolean
  onToggle: () => void
}

function Mes({ nombre, pagado, onToggle }: MesProps) {
  return (
    <li className={`px-3 pb-2 pt-1 rounded flex flex-col gap-2 justify-center ${pagado ? "bg-green-300" : "bg-gray-200"}`}>
      <span className="font-semibold text-lg text-center">{nombre}</span>
      {pagado
        ? <button onClick={onToggle} className="px-4 pb-1 bg-white opacity-50 hover:opacity-100 rounded">Pago</button>
        : <button onClick={onToggle} className="px-4 pb-1 bg-[#8cbfb3] rounded">No Pago</button>
      }
    </li>
  )
}

type Props = {
  meses: Calendario
  anio: number
  onToggleMes?: (i: number) => void
  onAnioAnterior: () => void
  onAnioSiguiente: () => void
}

export function CalendarioCuotas({ meses, anio, onToggleMes, onAnioAnterior, onAnioSiguiente }: Props) {
  const anioActual = new Date().getFullYear()

  return (
    <>
      <ul className="grid sm:grid-cols-3 grid-cols-2 gap-2">
        {meses.map((mes, i) => {
          const [nombre, pagado] = Object.entries(mes)[0]
          return <Mes key={nombre} nombre={nombre} pagado={pagado} onToggle={() => onToggleMes?.(i)} />
        })}
      </ul>

      <footer className="w-full pt-4 flex gap-6 justify-center items-center">
        <button onClick={onAnioAnterior} className="btn">
          {anio - 1}
        </button>
        <span className="font-semibold text-lg">{anio}</span>
        <button
          onClick={onAnioSiguiente}
          className={`btn ${anio >= anioActual ? "opacity-35 pointer-events-none" : ""}`}
          disabled={anio >= anioActual}
        >
          {anio + 1}
        </button>
      </footer>
    </>
  )
}
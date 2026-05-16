import { Prestamos } from "./Prestamos"
import { CalendarioCuotas } from "./CalendarioCuotas"
import { SocioDatos } from "./SocioDatos"
import { useSociosStore } from "../useSociosStore"

export function DetalleSocio() {
    const { anio, cuotas } = useSociosStore()
    
    if(!cuotas) return

    return (
        <div className="pt-4 grid grid-cols-[3fr_2fr] gap-4">
          <div className="flex flex-col gap-4">
            <SocioDatos />

            <div className="flex flex-col gap-4 card">
              <h2 className="text-xl font-semibold">Libros en Préstamo</h2>
              <Prestamos />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-4 bg-white rounded">
              <h2 className="pb-4 text-xl">Cuotas {anio}</h2>
              <CalendarioCuotas />
            </div>
            <div className="flex gap-4 card">
              <button className="px-4 pb-1 rounded bg-sky-200">Dar de baja</button>
              <button className="px-4 pb-1 rounded bg-sky-200">Re inscribir</button>
            </div>
          </div>
        </div>
    )
}
import { useSociosStore } from "@/store"
import { Prestamos } from "./Prestamos"
import { CalendarioCuotas } from "./CalendarioCuotas"
import { SocioDatos } from "./SocioDatos"
import { GestionEstadoSocio } from "./GestionEstadoSocio"
import { Observaciones } from "./Observaciones"
import { ChevronLeftIcon } from "@/components"
import { getCaracterSocio } from "@/models"

export function DetalleSocio() {
  const { anio, showListaSocios, socioSeleccionado } = useSociosStore()

  const caracterSocio = getCaracterSocio(socioSeleccionado?.caracterSocio)
  const cuotasDesactualizadas = caracterSocio.tieneCuotasDesactualizadas

  return (
    <>
      <p
        className="w-70 mt-2 px-2 pt-1 pb-1.5 flex items-center gap-2 opacity-90 rounded bg-white/40 hover:bg-white transition-colors duration-75 ease-in cursor-pointer"
        onClick={showListaSocios}
      >
        <ChevronLeftIcon />
        <span className="text-lg">Volver a la lista de socios</span>
      </p>

      <div className="pt-4 grid grid-cols-1 md:grid-cols-[3.2fr_1.8fr] gap-4">
        <div className="flex flex-col gap-4">
          <SocioDatos />

          <div className="flex flex-col gap-4 card">
            <h2 className="text-xl font-semibold">Libros en Préstamo</h2>
            <Prestamos onSuccess={() => {}} />
          </div>
          
          { !caracterSocio.estado && <Observaciones /> }
        </div>

        <div className="flex flex-col gap-4">
          <div className="card">
            <h2 className="pb-4 text-xl flex justify-between items-center">Cuotas {anio}
              {cuotasDesactualizadas && (<span className="font-2xl font-semibold bg-sky-300 px-4">ACTUALIZAR CUOTAS</span>)}
            </h2>
            <CalendarioCuotas />
          </div>

          { caracterSocio.estado && <Observaciones /> }
          
          <div className="flex gap-4 card">
            <GestionEstadoSocio />
          </div>
        </div>
      </div>
    </>
  )
}
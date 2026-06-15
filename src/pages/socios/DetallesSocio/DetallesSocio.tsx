import { useSettingsStore, useSociosStore } from "@/store"
import { Prestamos } from "./Prestamos"
import { CalendarioCuotas } from "./CalendarioCuotas"
import { SocioDatos } from "./SocioDatos"
import { GestionEstadoSocio } from "./GestionEstadoSocio"
import { Observaciones } from "./Observaciones"
import { ChevronLeftIcon } from "@/components"
import { getCaracterSocio } from "@/models"
import { cn, formatPrice } from "@/utils"

const anioActual: number = new Date().getFullYear()

export function DetalleSocio() {
  const { anio, showListaSocios, socioSeleccionado } = useSociosStore()
  const { precioCuota, gestionDeCuotas } = useSettingsStore()

  const caracterSocio = getCaracterSocio(socioSeleccionado?.caracterSocio)

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
          { gestionDeCuotas
          ? <div className="card">
            <h2 className="pb-4 text-2xl flex justify-between items-center">
              <span className="flex gap-2">
                Cuotas 
                <span
                  className={cn(
                    "rounded",
                    anio !== anioActual && "bg-amber px-1",
                    !caracterSocio.estado && "bg-amber px-1 font-bold",
                  )}
                >{anio}</span>
              </span>

              <span className="text-lg opacity-75 self-end">{ formatPrice(precioCuota) }</span>
            </h2>
            <CalendarioCuotas />
          </div>
          : <div className="card hidden md:block">Aqui estan los datos del socio y sus prestamos registrados.</div>
          }

          { caracterSocio.estado && <Observaciones /> }
          
          <div className="flex gap-4 card">
            <GestionEstadoSocio />
          </div>
        </div>
      </div>
    </>
  )
}

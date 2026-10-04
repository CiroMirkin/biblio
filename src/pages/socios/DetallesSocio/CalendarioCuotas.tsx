import { cn, formatPrice } from "@/utils"
import { useCuotasStore, useSettingsStore, useSocioSeleccionado } from "@/store"
import { getCaracterSocio } from "@/models"
import { Cuotas } from "./Cuotas"

export function CalendarioCuotas() {
  const { anio } = useCuotasStore()
  const { precioCuota } = useSettingsStore()
  const caracterSocio = getCaracterSocio(useSocioSeleccionado()?.caracterSocio)
  const anioActual = new Date().getFullYear()

  return (
    <div className="card">
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
      <Cuotas />
    </div>
  )
}

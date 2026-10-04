import { useState } from "react"
import { useSociosStore, useSocioSeleccionado } from "@/store"
import { Spinner } from "@/components"
import { getCaracterSocio } from "@/models"
import { cn } from "@/utils"

export function GestionEstadoSocio() {
    const { darDeBaja, reactivar } = useSociosStore()
    const socioSeleccionado = useSocioSeleccionado()
    const [cargando, setCargando] = useState(false)

    const isSocioActivo = getCaracterSocio(socioSeleccionado?.caracterSocio).estado

    const handleEstadoSocio = async () => {
        setCargando(true)
        try {
            if (!socioSeleccionado) return
            if (isSocioActivo) await darDeBaja(socioSeleccionado.nroSocio)
            else await reactivar(socioSeleccionado.nroSocio)
        }
        finally {
            setCargando(false)
        }
    }

    return (
        <button
            className={cn("px-4 pb-1 rounded btn", cargando && "btn-disabled")}
            onClick={handleEstadoSocio}
            disabled={cargando}
            >
            { cargando && 
                <span className="flex gap-1.5 items-center">
                    <Spinner /> Estableciendo...
                </span> 
            }
            { !cargando && (isSocioActivo ? "Dar de baja" : "Reactivar") }
        </button>
    )
}
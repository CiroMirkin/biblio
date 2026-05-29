import { useState } from "react"
import { useSociosStore } from "@/store"
import { Spinner } from "@/components"
import { getCaracterSocio } from "@/models"
import { cn } from "@/utils"

export function GestionEstadoSocio() {
    const { socioSeleccionado, darDeBaja, reactivar } = useSociosStore()
    const [cargando, setCargando] = useState(false)

    const isSocioActivo = getCaracterSocio(socioSeleccionado?.caracterSocio).estado

    const handleEstadoSocio = async () => {
        setCargando(true)
        try {
            if (isSocioActivo) await darDeBaja()
            else await reactivar()
        }
        finally {
            setCargando(false)
        }
    }

    return (
        <div className="flex gap-4 card">
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
        </div>
    )
}
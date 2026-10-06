import { archivarHistorial, getEstadoHistorial } from "@/services"
import { cn } from "@/utils"
import type { EstadoHistorial } from "@shared/models"
import { useEffect, useState } from "react"

export function ArchivarHistorial() {
    const [estado, setEstado] = useState<EstadoHistorial | null>(null)
    const [archivando, setArchivando] = useState(false)

    useEffect(() => {
        getEstadoHistorial().then(setEstado)
    }, [])

    if (!estado || estado.registros <= estado.limite || estado.anio === null) return null
    const { registros, limite, anio, cantidad } = estado

    async function handleArchivar() {
        if (!confirm(`Se archivarán ${cantidad} préstamos devueltos en ${anio}. ¿Continuar?`)) return
        setArchivando(true)
        await archivarHistorial()
        setEstado(await getEstadoHistorial())
        setArchivando(false)
    }

    return (
        <div className="pt-4 flex flex-col gap-2">
            <h3 className="font-semibold text-lg">Historial de préstamos</h3>
            <p className="opacity-80">
                El historial tiene {registros} registros y supera el límite de {limite}, lo que puede hacer lentas las consultas.
                Los préstamos archivados se pueden seguir viendo desde el historial de cada socio o libro.
            </p>
            <button
                className={cn("btn self-start", archivando && "btn-disabled")}
                disabled={archivando}
                onClick={handleArchivar}
            >
                {archivando ? 'Archivando...' : `Archivar préstamos devueltos en ${anio}`}
            </button>
        </div>
    )
}

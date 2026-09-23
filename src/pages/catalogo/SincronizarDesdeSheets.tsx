import { SincronizacionService } from "@/services"
import { cn } from "@/utils"
import { useEffect, useState } from "react"

export function SincronizarDesdeSheets() {
    const [disponible, setDisponible] = useState(false)
    const [cargando, setCargando] = useState(false)
    const [resultado, setResultado] = useState<{ ok: boolean, mensaje: string } | null>(null)

    useEffect(() => {
        SincronizacionService.disponible().then(setDisponible)
    }, [])

    async function handleClick() {
        setCargando(true)
        setResultado(null)
        const res = await SincronizacionService.ejecutar()
        setResultado(
            res.ok
                ? { ok: true, mensaje: `${res.cantidad} libro${res.cantidad === 1 ? '' : 's'} agregado${res.cantidad === 1 ? '' : 's'}` }
                : { ok: false, mensaje: res.error }
        )
        setCargando(false)
    }

    if (!disponible) return null

    return (
        <section className="card card-secondary mt-4 flex flex-col gap-2">
            <button
                className={cn("btn", cargando && "btn-disabled")}
                disabled={cargando}
                onClick={handleClick}
            >
                { cargando ? 'Sincronizando...' : 'Sincronizar con inventario' }
            </button>
            <div className="w-full flex flex-col text-sm">
                { resultado &&
                    <span className={cn("font-semibold", resultado.ok ? "text-green" : "text-red")}>
                        { resultado.mensaje }
                    </span>
                }
                { resultado?.ok &&
                    <span className="text-wrap">Para ver los ingresos cierra y vuelve a abrir el sistema.</span>
                }
            </div>
        </section>
    )
}

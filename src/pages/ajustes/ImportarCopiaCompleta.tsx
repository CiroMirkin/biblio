import { ExcelExportService } from "@/services"
import { cn } from "@/utils"
import { useState } from "react"

export function ImportarCopiaCompleta() {
    const [cargando, setCargando] = useState<boolean>(false)
    const [ res, setRes ] = useState({
        ok: null as boolean | null,
        message: "",
    })

    async function handleDescargar() {
        setCargando(true)
        const { ok, message } = await ExcelExportService.importarCopiaDeSeguridad()
        setRes({ ok, message })
        setCargando(false)
    }

    return (
        <div className="flex flex-col gap-2 card">
            <h3 className="font-semibold text-lg">Importar copia de completa de los archivos Excel.</h3>
            { res !== null &&  res.ok 
                ? <span className="mb-1 text-lg font-semibold text-greem bg-white">
                    { res.message }
                    <span className="pl-4 text-2xl font-bold">
                        Cierre el sistema y vuelva a iniciarlo.
                    </span>
                </span>

                : <span className="mb-1 text-lg font-semibold text-red">
                    { res.message }
                </span>
            }
            <div className="flex gap-2">
                <button
                    className={cn("btn", cargando && "btn-disabled")}
                    disabled={cargando}
                    onClick={() => handleDescargar()}
                >
                    { cargando ? 'Importando...' : 'Importar copia completa' }
                </button>
            </div>
        </div>
    )
}
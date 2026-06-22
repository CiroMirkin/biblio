import { Spinner } from "@/components"
import { ExcelExportService } from "@/services";
import { cn } from "@/utils"
import { useState } from "react"

export function DescargarArchivoMrc() {
    const [loading, setCargando] = useState<boolean>(false)

    async function handleDescargar() {
        if(loading) return;

        setCargando(true)
        await ExcelExportService.descargarInventarioEnMRC()
        setCargando(false)
    }

    return (
        <div className="flex flex-col gap-2 card">
            <h3 className="font-semibold text-lg">Descargar inventario de libro para subirlo al Koha</h3>
            <div className="flex gap-2">
                <button
                    className={cn("btn flex items-center justify-center gap-1.5", loading && "btn-disabled")}
                    disabled={loading}
                    onClick={() => handleDescargar()}
                >
                    { loading && <Spinner /> }
                    <span>
                        { loading ? 'Descargando...' : 'Descargar archivo ".mrc"' }
                    </span>
                </button>
            </div>
        </div>
    )
}
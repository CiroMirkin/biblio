import { ExcelExportService } from "@/services"
import { cn } from "@/utils"
import { useState } from "react"

export function CopiarExcels() {
    const [cargando, setCargando] = useState<ArchivoKey | null>(null)

    async function handleDescargar(key: ArchivoKey) {
        setCargando(key)
        if (key === 'socios') await ExcelExportService.descargarSocios()
        if (key === 'cuotas') await ExcelExportService.descargarCuotas()
        if (key === 'libros') await ExcelExportService.descargarLibros()
        if (key === 'completo') await ExcelExportService.copiaDeSeguridad()
        setCargando(null)
    }

    return (
        <div className="flex flex-col gap-2 card">
            <h3 className="font-semibold text-lg">Obtener copia archivos Excel</h3>
            <div className="flex gap-2">
                <button
                    className={cn("btn", cargando === "socios" && "btn-disabled")}
                    disabled={!!cargando}
                    onClick={() => handleDescargar('socios')}
                >
                    {cargando === 'socios' ? 'Copiando socios...' : 'Socios'}
                </button>
                <button
                    className={cn("btn", cargando === "cuotas" && "btn-disabled")}
                    disabled={!!cargando}
                    onClick={() => handleDescargar('cuotas')}
                >
                    {cargando === 'cuotas' ? 'Copiando cuotas...' : 'Cuotas'}
                </button>
                <button
                    className={cn("btn", cargando === "libros" && "btn-disabled")}
                    disabled={!!cargando}
                    onClick={() => handleDescargar('libros')}
                >
                    {cargando === 'libros' ? 'Copiando libros...' : 'Libros'}
                </button>
                <button
                    className={cn("ml-4 btn", cargando === "completo" && "btn-disabled")}
                    disabled={!!cargando}
                    onClick={() => handleDescargar('completo')}
                >
                    {cargando === 'completo' ? 'Exportando copia...' : 'Copia completa'}
                </button>
            </div>
        </div>
    )
}
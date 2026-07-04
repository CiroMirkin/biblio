import { Spinner, Toggle } from "@/components"
import { ExcelExportService } from "@/services";
import { cn } from "@/utils"
import { useState } from "react"

export function DescargarArchivoMrc() {
    const [loading, setCargando] = useState<boolean>(false)
    const [ excluirSinISBN, setExcluirSinISBN ] = useState(true)

    async function handleDescargar() {
        if(loading) return;

        setCargando(true)
        await ExcelExportService.descargarInventarioEnMRC(excluirSinISBN)
        setCargando(false)
    }

    return (
        <div className="flex flex-col gap-2 card">
            <h3 className="font-semibold text-lg">Descargar inventario de libros para subirlo al Koha</h3>
            <div className="my-2">
                <Toggle
                    labelOn="Ignorar libros sin ISBN establecido (evita duplicar registros al importar el archivo en Koha)."
                    labelOff="Incluir libro con y sin ISBN."
                    value={excluirSinISBN}
                    onChange={setExcluirSinISBN}
                    name="excluir-sin-ISBN"
                />
            </div>
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
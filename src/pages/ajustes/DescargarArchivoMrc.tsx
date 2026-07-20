import { Spinner, Toggle } from "@/components"
import { ExcelExportService } from "@/services";
import { cn } from "@/utils"
import { useState } from "react"

const OPCIONES_FECHA: { value: PeriodoDeIngreso; label: string }[] = [
    { value: 'todos', label: 'Todas las existencias' },
    { value: 'hoy', label: 'Ingresados hoy' },
    { value: 'semana', label: 'Ingresados la última semana' },
    { value: 'mes', label: 'Ingresados el último mes' },
    { value: 'año', label: 'Ingresados el último año' },
]

export function DescargarArchivoMrc() {
    const [loading, setCargando] = useState<boolean>(false)
    const [ excluirSinISBN, setExcluirSinISBN ] = useState(true)
    const [ fecha, setfecha ] = useState<PeriodoDeIngreso>('todos')

    async function handleDescargar() {
        if(loading) return;

        setCargando(true)
        await ExcelExportService.descargarInventarioEnMRC({ excluirSinISBN, periodoDeIngreso: fecha })
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

            <div className="mb-2 flex flex-col gap-1">
                <span className="text-sm font-medium">Filtrar registros</span>
                <div className="flex flex-col flex-wrap">
                    { OPCIONES_FECHA.map(opcion => (
                        <label key={opcion.value} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                                type="radio"
                                name="fecha-mrc"
                                value={opcion.value}
                                checked={fecha === opcion.value}
                                onChange={() => setfecha(opcion.value)}
                            />
                            <span>{opcion.label}</span>
                        </label>
                    )) }
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    className={cn("btn py-1 flex items-center justify-center gap-1.5", loading && "btn-disabled")}
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
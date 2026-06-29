import { isMarc21, type LibroEnPrestamo, type LibroRegistrado } from "@shared/models"
import { calcularDiasDesdePrestamo, cn, formatDiasRelativo, formatNro } from "@/utils"
import { useSettingsStore, useSociosStore } from "@/store"
import { LibroDisponible } from "./LibroDisponible"
import { format } from "@formkit/tempo"
import { DetallesLibro } from "./DetallesLibro"

type Props = {
  libro: LibroRegistrado
}

export function LibroEnPrestamo({ libro }: Props) {
    const { limiteDeDias, numerosDeInventarioExternos } = useSettingsStore()

    if(libro.fechaDePrestamo === null) {
        return <LibroDisponible libro={libro} />
    }

    const dias = calcularDiasDesdePrestamo(libro.fechaDePrestamo!)

    const { socios } = useSociosStore()
    const socio = socios.find(s =>
        s.nroSocio === libro.numeroSocio || s.nombreYApellido === libro.nombreSocio
    ) ?? null

    const mostrarNroDeInventario = numerosDeInventarioExternos && !isMarc21(libro)

    return (
        <li className="card flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-xl">{libro.titulo}</p>
                    <p className="text-base font-semibold">{libro.autor}</p>
                    { mostrarNroDeInventario && 
                        <p className="text-base mt-px">
                            <span className="mr-1 font-semibold">N°</span>
                            { 
                                libro.numeroInventario!.toString().startsWith('SN-') || !libro.numeroInventario 
                                ? 'S/N' : formatNro(libro.numeroInventario)
                            }
                        </p>
                    }
                </div>
                <span className={cn(
                    "flex flex-col items-end text-base font-semibold",
                    dias > limiteDeDias ? "text-red" : "text-greem"
                )}>
                    <span className="text-lg">{ formatDiasRelativo(dias) }</span>
                    { format(libro.fechaDePrestamo!, "long") }
                </span>
            </div>

            <DetallesLibro libro={libro} />

            <hr className="opacity-20 my-2" />
            <div className="text-base opacity-70">
                <p>
                    <span className="font-semibold">Socio: </span>
                    {socio?.nombreYApellido ?? libro.nombreSocio}
                </p>
                {socio && <>
                    <p><span className="font-semibold">N° Socio:</span> {socio.nroSocio}</p>
                    <p><span className="font-semibold">Telefono:</span> {socio.telefono ?? "-"}</p>
                    <p><span className="font-semibold">Domicilio:</span> {socio.domicilio}</p>
                </>}
            </div>
        </li>
    )
}

import type { LibroEnPrestamo } from "@/models"
import { calcularDiasDesdePrestamo, cn } from "@/utils"
import { useSociosStore } from "../socios/useSociosStore"
import { useLibrosStore } from "@/store"

type Props = {
  libro: LibroEnPrestamo
}

export function LibroEnPrestamo({ libro }: Props) {
    const { limiteDeDias } = useLibrosStore()
    if(libro.fechaDePrestamo === null) return

    const dias = calcularDiasDesdePrestamo(libro.fechaDePrestamo!)

    const { socios } = useSociosStore()
    const socio = socios.find(s =>
        s.nroSocio === libro.numeroSocio || s.nombreYApellido === libro.nombreSocio
    ) ?? null
    
    return (
        <li className="card flex flex-col gap-1">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-xl">{libro.titulo}</p>
                    <p className="text-base opacity-70">{libro.autor}</p>
                </div>
                <span className={cn(
                    "flex flex-col items-end text-base font-semibold",
                    dias > limiteDeDias ? "text-red-600" : "text-green-600"
                )}>
                    <span className="text-lg">{dias} días</span>
                    {libro.fechaDePrestamo!.toLocaleDateString(
                        'es-AR', 
                        { weekday: 'long', day: 'numeric', month: 'long' }
                    )}
                </span>
            </div>
            <hr className="opacity-20" />
            <div className="text-sm">
                <p>
                    <span className="font-semibold">Socio:</span>
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

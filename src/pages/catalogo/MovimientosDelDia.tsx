import { useLibrosStore, useSettingsStore } from "@/store"
import { buscarLibrosDeHoy, cn } from "@/utils"
import { buscarLibrosRegistradosHoy } from "@shared/utils"

interface Props {
    className?: string
}

export default function MovimientosDelDia({ className = "" }: Props) {
    const {
        librosPrestados,
        libros,
    } = useLibrosStore()
    const { numerosDeInventarioExternos } = useSettingsStore()

    const librosPrestadosHoy = buscarLibrosDeHoy(librosPrestados).length
    const ingresadosHoy = buscarLibrosRegistradosHoy(libros).length

    return (
        <section className={cn("w-60 card card-secondary", className)}>
            <div className="text-lg font-semibold opacity-65 leading-none mb-1">Movimientos del dia</div>
            <ul>
                <li>
                    <span className="font-semibold opacity-65">Prestados: </span>
                    { librosPrestadosHoy }
                </li>
                { numerosDeInventarioExternos &&
                <li>
                    <span className="font-semibold opacity-65">Ingresos al catalogo: </span>
                    { ingresadosHoy }
                </li>
                }
            </ul>
        </section>
    )
}
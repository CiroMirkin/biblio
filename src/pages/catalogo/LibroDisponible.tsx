import type { Libro } from "@/models"

type Props = {
    libro: Libro
}

export function LibroDisponible({ libro }: Props) {
    return (
        <li className="card flex gap-1 justify-between items-start">
            <div>
                <p className="font-semibold text-xl">{libro.titulo}</p>
                <p className="text-base">{libro.autor}</p>
                <p className="text-sm opacity-70 mt-px">
                    N° de Inventario: 
                    {libro.numeroInventario || " S/N"}
                </p>
            </div>
            <span className="text-base font-semibold text-green-600">Disponible</span>
        </li>
    )
}
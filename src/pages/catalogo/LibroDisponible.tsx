import type { Libro } from "@/models"
import { useLibrosStore } from "@/store"

type Props = {
    libro: Libro
}

export function LibroDisponible({ libro }: Props) {
    const { verDetallesLibro } = useLibrosStore()
    
    return (
        <li className="card">
            <div className="flex gap-1 justify-between items-start">
                <div>
                    <p className="font-semibold text-xl">{libro.titulo}</p>
                    <p className="text-base">{libro.autor}</p>
                    <p className="text-base opacity-80 mt-px">
                        <span className="mr-1 font-semibold">N° </span>
                        { libro.numeroInventario || "S/N" }
                    </p>
                </div>
                <span className="text-base font-semibold text-greem">Disponible</span>
            </div>
            <div className="flex justify-end">
                <button className="btn-secondary text-black/85 text-base pt-0.5 cursor-pointer hover:underline" onClick={() => verDetallesLibro(libro)}>Editar Libro</button>
            </div>
        </li>
    )
}
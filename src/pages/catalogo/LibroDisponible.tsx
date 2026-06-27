import { isMarc21, type Libro } from "@shared/models"
import { DetallesLibro } from "./DetallesLibro"
import { formatNro } from "@/utils"

type Props = {
    libro: Libro
}

export function LibroDisponible({ libro }: Props) {
    
    return (
        <li className="card">
            <div className="flex gap-1 justify-between items-start">
                <div>
                    <p className="font-semibold text-xl">{libro.titulo}</p>
                    <p className="text-base">{libro.autor}</p>
                    { !isMarc21(libro) && 
                        <p className="text-base opacity-80 mt-px">
                            <span className="mr-1 font-semibold">N° </span>
                            { libro.numeroInventario ? formatNro(libro.numeroInventario) : "S/N" }
                        </p>
                    }
                </div>
                <span className="text-base font-semibold text-greem">Disponible</span>
            </div>
            <DetallesLibro libro={libro} />
        </li>
    )
}
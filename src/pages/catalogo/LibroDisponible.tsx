import { type Libro } from "@shared/models"
import { DetallesLibro } from "./DetallesLibro"

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
                </div>
                <span className="text-base font-semibold text-greem">Disponible</span>
            </div>
            <DetallesLibro libro={libro} />
        </li>
    )
}
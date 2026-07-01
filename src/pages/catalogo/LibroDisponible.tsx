import { isMarc21, parceLiteraryForm, type Libro } from "@shared/models"
import { DetallesLibro } from "./DetallesLibro"
import { cn } from "@/utils"

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
                        <div className="">
                            <span
                                className={cn(
                                    "mr-1 font-semibold opacity-85",
                                    libro.literaryForm ? "block" : "hidden"
                                )}
                            >
                                { parceLiteraryForm(libro.literaryForm) }
                            </span>
                        </div>
                    }
                </div>
                <span className="text-base font-semibold text-greem">Disponible</span>
            </div>
            <DetallesLibro libro={libro} />
        </li>
    )
}
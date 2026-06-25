import { AnimatePresence, motion } from "motion/react"
import { callNumberToString, isMarc21, parceLiteraryForm, type Libro, type LibroRegistrado, type Marc21 } from "@/models"
import { useState } from "react"
import { useLibrosStore } from "@/store"
import { cn } from "@/utils"

interface Props {
    libro: LibroRegistrado | Libro | Marc21
}

export function DetallesLibro({ libro }: Props) {
    const [expandido, setExpandido] = useState(false)
    const { verDetallesLibro } = useLibrosStore()
    const isMarc = isMarc21(libro)

    return (
        <>
            <AnimatePresence>
                {expandido && (
                    <motion.div
                    className="list-disc"
                    initial={{ opacity: 0, height: 0, }}
                    animate={{ opacity: 1, height: "auto", }}
                    exit={{ opacity: 0, height: 0, }}
                    style={{ overflow: "hidden", }}
                    >
                        { isMarc && <Detalles libro={libro} /> }
                        
                        <button
                            className="mt-4 self-start btn-secondary text-black/85 text-base pt-0.5 cursor-pointer hover:underline"
                            onClick={() => verDetallesLibro(libro)}
                        >
                            Editar Libro
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={cn( isMarc ? "flex justify-between": "self-end")}>
                { isMarc && 
                    <span className={cn("pb-1 font-semibold opacity-80", expandido && "opacity-0")}>
                        { callNumberToString(libro.holding.callNumber) }
                    </span>
                }
                <button
                    className="text-sm self-end opacity-60 hover:opacity-100 transition-opacity hover:underline"
                    onClick={() => setExpandido(prev => !prev)}
                >
                    {expandido ? "Mostrar menos datos" : "Mostrar mas datos"}
                </button>
            </div>
        </>
    )
}

function Detalles({ libro }: { libro: Marc21 }) {
    const publicNote = libro.holding.publicNote
    return (
        <ul className="pt-2 list-disc pl-6 text-base">
            <li className="group flex items-center justify-start">
                <span className="font-semibold opacity-80 cursor-default mr-1 mb-2">
                    Signatura: { callNumberToString(libro.holding.callNumber) }
                </span>
             </li>
            <li className="group flex items-center justify-start">
                <span className="cursor-default mr-1">
                    <span className="font-semibold">Forma literaria:</span>
                    { parceLiteraryForm(libro.literaryForm) }
                </span>
             </li>
            <li className="group flex items-center justify-start">
                <span className="cursor-default mr-1 mb-1">
                    <span className="font-semibold">País de origen del autor:</span>
                </span>
             </li>
            { publicNote && 
                <li className="group flex items-center justify-start">
                    <span className="cursor-default mr-1 my-1">
                        <span className="font-semibold">Observaciones / Notas publicas:</span>
                        { publicNote }
                    </span>
                </li>
            }
            <li className="group flex items-center justify-start mt-1">
                <span className="cursor-default mr-1">Editorial: { libro.publisher }</span>
            </li>
            <li className="group flex items-center justify-start">
                <span className="cursor-default mr-1">Edición: { libro.edition }</span>
            </li>
            <li className="group flex items-center justify-start">
                <span className="cursor-default mr-1">Lugar de publicación: { libro.placeOfPublication }</span>
             </li>
            <li className="group flex items-center justify-start">
                <span className="cursor-default mr-1">Año de publicación: { libro.publicationYear }</span>
            </li>
        </ul>
    )
}
import { AnimatePresence, motion } from "motion/react"
import { isMarc21, type Libro, type LibroRegistrado, type Marc21, formatLiteraryForm } from "@shared/models"
import { useState } from "react"
import { useLibrosStore, useSettingsStore } from "@/store"
import { cn, formatNro } from "@/utils"
import { getDatosDelDewey } from "@shared/models/dewey"

interface Props {
    libro: LibroRegistrado | Libro | Marc21
}

export function DetallesLibro({ libro }: Props) {
    const [expandido, setExpandido] = useState(false)
    const { verDetallesLibro } = useLibrosStore()
    const { catalogacionSimple, numerosDeInventarioExternos } = useSettingsStore()
    const isMarc = isMarc21(libro)

    if(catalogacionSimple) {
        return (
         <div className="w-full flex justify-end">
            <button
                className="mb-2 btn-secondary text-black/85 text-base pt-0.5 cursor-pointer hover:underline"
                onClick={() => verDetallesLibro(libro)}
            >
                Editar Libro
            </button>
         </div>   
        )
    }

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
                    onClick={() => setExpandido((prev) => !prev)}
                    >
                        { isMarc && <MarkDetalles libro={libro} /> }
                        { (!isMarc && numerosDeInventarioExternos) && 
                            <p className="text-base opacity-80 mt-1">
                                <span className="mr-1 font-semibold">N° </span>
                                { libro.numeroInventario ? formatNro(libro.numeroInventario) : "S/N" }
                            </p>
                        }
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                className={cn(
                    "mt-0.5 flex", 
                    (!isMarc && !expandido) && "justify-end",
                    isMarc && "justify-between",
                    expandido && "justify-between",
                )}
            >
                { isMarc && 
                    <span className={cn("flex gap-2 font-semibold opacity-80 mt-1", expandido && "hidden")}>
                        <span className="font-normal">{ formatNro(libro.numeroInventario) }</span>
                        <span>{ getDatosDelDewey(libro?.dewey).genero }</span>
                        <span className="opacity-70">{ libro.authorCountry }</span>
                    </span>
                }
                <button
                    className={cn(
                        "mt-4 self-start btn-secondary text-black/85 text-base pt-0.5 cursor-pointer hover:underline",
                        expandido ? "block" : "hidden"
                    )}
                    onClick={() => verDetallesLibro(libro)}
                >
                    Editar Libro
                </button>
                <button
                    className="text-sm self-end opacity-60 hover:opacity-100 transition-opacity hover:underline"
                    onClick={() => setExpandido(prev => !prev)}
                >
                    { isMarc
                        ? ( expandido ? "Mostrar menos datos" : "Mostrar mas datos" )
                        : ( expandido ? "Ocultar opciones" : "Mostrar opciones" )
                    }
                </button>
            </div>
        </>
    )
}

function MarkDetalles({ libro }: { libro: Marc21 }) {
    const publicNote = libro.holding.publicNote
    const dewey = libro?.dewey ?? "Desconocido"
    const signatura = libro?.holding?.callNumber || ""
    const authorCountry = libro.authorCountry
    const literaryForm = formatLiteraryForm(libro.literaryForm)

    return (
        <ul className="pt-2 list-disc pl-6 text-base">
            <li className="group flex items-center justify-start">
                <span className="flex gap-2 font-semibold opacity-80 cursor-default mr-1">
                    <span>CDD:</span>
                    <span>{ dewey }</span>
                </span>
             </li>
            <li className="group flex items-center justify-start">
                <span className="cursor-default mr-1">
                    <span className="font-semibold mr-2">N° de inventario:</span>
                    { formatNro(libro.numeroInventario) }
                </span>
             </li>
            { literaryForm && 
                <li className="group flex items-center justify-start">
                    <span className="cursor-default mr-1">
                        <span className="font-semibold mr-2">Forma literaria:</span>
                        { literaryForm }
                    </span>
                </li>
            }
            { authorCountry && 
                <li className="group flex items-center justify-start">
                    <span className="cursor-default mr-1">
                        <span className="font-semibold mr-2">País de origen del autor:</span>
                        { authorCountry }
                    </span>
                </li>
            }
            { signatura &&
                <li className="group flex items-center justify-start opacity-75">
                    <span className="cursor-default mr-1">
                        <span className="mr-2">Signatura:</span>
                        { signatura }
                    </span>
                </li>
            }
            { publicNote && 
                <li className="group flex items-center justify-start">
                    <span className="cursor-default mr-1 mt-1">
                        <span className="font-semibold mr-2">Observaciones / Notas publicas:</span>
                        { publicNote }
                    </span>
                </li>
            }
            <span className="block w-full h-2.5" />
            { libro.holding.barcode && 
                <li className="group flex items-center justify-start opacity-75">
                    <span className="cursor-default mr-1">Código de barras / ISBN:</span>
                    { libro.holding.barcode }
                </li>
            }
            { libro.publisher && 
                <li className="group flex items-center justify-start opacity-75 cursor-default">
                    Editorial: { libro.publisher }
                </li>
            }
            { libro.edition && 
                <li className="group flex items-center justify-start opacity-75 cursor-default">
                    Edición: { libro.edition }
                </li>
            }
            { libro.placeOfPublication && 
            <li className="group flex items-center justify-start opacity-75 cursor-default">
                Lugar de publicación: { libro.placeOfPublication }
             </li>
            }
            { libro.publicationYear && 
                <li className="group flex items-center justify-start opacity-75 cursor-default">
                    Año de publicación: { libro.publicationYear }
                </li>
            }
        </ul>
    )
}
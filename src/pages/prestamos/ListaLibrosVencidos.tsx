import { useLibrosStore } from "@/store"
import { LibroEnPrestamo } from "./LibroEnPrestamo"

export function ListaLibrosVencidos() {
    const { librosVencidos} = useLibrosStore()
    
    if (librosVencidos.length === 0) return <p className="p-4">No hay préstamos vencidos.</p>
    
    return (
        <ul className="flex flex-col gap-3 p-4">
            {librosVencidos.map(libro => (
                <LibroEnPrestamo key={libro.numeroInventario} libro={libro} />
            ))}
        </ul>
    )
}
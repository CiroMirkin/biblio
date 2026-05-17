import { useLibrosStore } from "@/store"
import { LibroEnPrestamo } from "./LibroEnPrestamo"

export function ListaLibrosEnPrestamo() {
    const { librosFiltrados } = useLibrosStore()

    if(!librosFiltrados.length) return
    
    return (
        <ul className="flex flex-col gap-3 p-4">
            {librosFiltrados.map(libro => (
                <LibroEnPrestamo key={libro.numeroInventario} libro={libro} />
            ))}
        </ul>
    )
}

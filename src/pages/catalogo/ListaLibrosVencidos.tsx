import { useLibrosStore } from "@/store"
import { LibroEnPrestamo } from "./LibroEnPrestamo"

export function ListaLibrosVencidos() {
    const { librosVencidos, librosFiltrados } = useLibrosStore()
    
    if(librosFiltrados.length !== 0) return
    if (librosVencidos.length === 0) return <p className="mt-4 card opacity-80">No hay libros en préstamo vencidos, pero puedes buscar información sobre un libro y el socio que lo posee.</p>
    
    return (
        <ul className="flex flex-col gap-3 py-4">
            {librosVencidos.map(libro => (
                <LibroEnPrestamo key={libro.numeroInventario} libro={libro} />
            ))}
        </ul>
    )
}
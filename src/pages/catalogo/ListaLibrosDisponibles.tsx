import { useLibrosStore } from "@/store"
import { LibroDisponible } from "./LibroDisponible"

/** Lista de libros que no estan en prestamo. */
export function ListaLibrosDisponibles() {
    const { librosDisponiblesFiltrados } = useLibrosStore()

    if (!librosDisponiblesFiltrados.length) return

    return (
        <ul className="flex flex-col gap-3 py-4">
            {librosDisponiblesFiltrados.map(libro => (
                <LibroDisponible key={libro.numeroInventario} libro={libro} />
            ))}
        </ul>
    )
}

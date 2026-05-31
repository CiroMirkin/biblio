import { useLibrosStore } from "@/store"

export function RecuentoLibros() {
    const {
        librosVencidos,
        librosDisponibles,
        librosPrestados,
        libros
    } = useLibrosStore()

    return (
        <section className="w-60 card card-secondary">
            <ul>
                <li>
                    <span className="font-semibold opacity-65">Libros adeudados: </span>
                    { librosVencidos.length }
                </li>
                <li>
                    <span className="font-semibold opacity-65">Libros prestados: </span>
                    { librosPrestados.length }
                </li>
                <li>
                    <span className="font-semibold opacity-65">Libros disponibles: </span>
                    { librosDisponibles.length }
                </li>
                <li>
                    <span className="font-semibold opacity-65">Total de Libros: </span>
                    { libros.length }
                </li>
            </ul>
        </section>
    )
}
import { useLibrosStore, type AreasDeBusqueda } from "@/store"

export function Filtros() {
    const {
        librosVencidos,
        librosDisponibles,
        librosPrestados,
        setAreaBusqueda,
        areaBusqueda,
    } = useLibrosStore()

    const handleCheck = (area: AreasDeBusqueda) => {
        setAreaBusqueda(area)
    }

    return (
        <section className="card bg-white/90">
            <p className="mb-2 font-semibold text-lg">Ver solo: </p>
            <ul className="flex flex-col gap-1">
                <li className="flex items-center gap-1.5" onClick={() => handleCheck("vencidos")}>
                    <input type="checkbox" name="vencidos" id="vencidos" className="accent-accent" checked={areaBusqueda === "vencidos"} />
                    <label htmlFor="vencidos">Libros vencidos</label>
                    <span className="opacity-50 text-sm">( { librosVencidos.length } )</span>
                </li>
                <li className="flex items-center gap-1.5" onClick={() => handleCheck("prestados")}>
                    <input type="checkbox" name="prestados" id="prestados" className="accent-accent" checked={areaBusqueda === "prestados"} />
                    <label htmlFor="prestados">Libros prestados</label>
                    <span className="opacity-50 text-sm">( { librosPrestados.length } )</span>
                </li>
                <li className="flex items-center gap-1.5" onClick={() => handleCheck("disponibles")}>
                    <input type="checkbox" name="disponibles" id="disponibles" className="accent-accent" checked={areaBusqueda === "disponibles"}  />
                    <label htmlFor="disponibles">Libros disponibles</label>
                    <span className="opacity-50 text-sm">( { librosDisponibles.length } )</span>
                </li>
                <li className="flex items-center gap-1.5" onClick={() => handleCheck("all")}>
                    <input type="checkbox" name="all" id="all" className="accent-accent" checked={areaBusqueda === "all"} />
                    <label htmlFor="all">Todos los libros</label>
                    <span className="opacity-50 text-sm">( { librosDisponibles.length } )</span>
                </li>
            </ul>
        </section>
    )
}
import { useSociosStore } from "@/store"

export function RecuentoSocios() {
    const { sociosActivos, sociosInactivos, sociosConLibros } = useSociosStore()
    
    return (
        <section className="w-50 card card-secondary mt-4">
            <ul className="">
                <li>
                    <span className="font-semibold opacity-65">Socios activos: </span>
                    { sociosActivos }
                </li>
                <li>
                    <span className="font-semibold opacity-65">Socios inactivos: </span>
                    { sociosInactivos }
                </li>
                <li>
                    <span className="font-semibold opacity-65">Total de socios: </span>
                    { sociosActivos + sociosInactivos }
                </li>
                <li className="mt-2.5 pt-1.5 border-t border-black/20">
                    <span className="font-semibold opacity-65">Socios con libros: </span>
                    { sociosConLibros.length }
                </li>
            </ul>
        </section>
    )
}
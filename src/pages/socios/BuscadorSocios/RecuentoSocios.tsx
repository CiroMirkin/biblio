import { useSociosStore } from "@/store"

export function RecuentoSocios() {
    const { sociosActivos, sociosInactivos } = useSociosStore()
    
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
            </ul>
        </section>
    )
}
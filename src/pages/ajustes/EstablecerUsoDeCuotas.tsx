import { Toggle } from "@/components"
import { useSociosStore } from "@/store"

export function EstablecerUsoDeCuotas() {
    const { gestionDeCuotas, toggleGestionDeCuotas } = useSociosStore()

    return (
        <section className="card">
            <h2 className="text-lg mb-2">Requiero gestionar gestionar cuotas mensuales:</h2>
            <Toggle
                labelOn="Requiero gestionar cuotas"
                labelOff="No requiero gestionar cuotas"
                value={gestionDeCuotas}
                name="gestion-cuotas"
                onChange={toggleGestionDeCuotas}
            />
        </section>
    )
}
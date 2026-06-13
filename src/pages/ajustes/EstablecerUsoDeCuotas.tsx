import { Toggle } from "@/components"
import { useSettingsStore } from "@/store"

export function EstablecerUsoDeCuotas() {
    const { gestionDeCuotas, toggleSetting } = useSettingsStore()

    const toggle = () => toggleSetting('gestionDeCuotas')

    return (
        <section className="card">
            <h2 className="text-lg mb-2">Requiero gestionar gestionar cuotas mensuales:</h2>
            <Toggle
                labelOn="Requiero gestionar cuotas"
                labelOff="No requiero gestionar cuotas"
                value={gestionDeCuotas}
                name="gestion-cuotas"
                onChange={toggle}
            />
        </section>
    )
}

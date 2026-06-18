import { Toggle } from "@/components";
import { useSettingsStore } from "@/store";

export function PermitirVincularSocios() {
    const { vincularSocios, toggleSetting } = useSettingsStore()

    const toggle = () => {
        toggleSetting('vincularSocios')
    }
    return (
        <section className="card">
            <h2 className="text-lg mb-2">Quiero poder vincular socios:</h2>
            <Toggle
                labelOn="Quiero vincular socios"
                labelOff="No requiero vincular socios"
                value={vincularSocios}
                name="vincular-socios"
                onChange={toggle}
            />
        </section>
    )
}
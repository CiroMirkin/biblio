import { Toggle } from "@/components"
import { useSettingsStore } from "@/store"

export function ComoEstablecerFechaPrestamo() {
    const { fechaDePrestamoAutomatica, toggleSetting } = useSettingsStore()

    const toggle = () => toggleSetting('fechaDePrestamoAutomatica')

    return (
        <section className="card">
            <h2 className="text-lg mb-2">Establecer fecha de préstamo automáticamente</h2>
            <Toggle
                labelOn="Quiero que sea automático"
                labelOff="No quiero que sea automático"
                value={fechaDePrestamoAutomatica}
                onChange={toggle}
            />
        </section>
    )
}

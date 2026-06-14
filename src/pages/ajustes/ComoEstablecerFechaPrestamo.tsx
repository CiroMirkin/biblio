import { Toggle } from "@/components"
import { useSettingsStore } from "@/store"

export function ComoEstablecerFechaPrestamo() {
    const { fechaDePrestamoAutomatica, toggleSetting } = useSettingsStore()

    const toggle = () => toggleSetting('fechaDePrestamoAutomatica')

    return (
        <section className="card">
            <h2 className="text-lg mb-2">Fecha de préstamo:</h2>
            <Toggle
                labelOn="Quiero que la fecha de préstamo se establezca automáticamente."
                labelOff="Quiero establecer la fecha de préstamo manualmente."
                value={fechaDePrestamoAutomatica}
                onChange={toggle}
                name="fecha-de-prestamo"
            />
        </section>
    )
}

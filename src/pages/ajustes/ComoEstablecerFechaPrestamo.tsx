import { Toggle } from "@/components"
import { useLibrosStore } from "@/store"

export function ComoEstablecerFechaPrestamo() {
    const { fechaDePrestamoAutomatica, toggleFechaDePrestamoAutomatica } = useLibrosStore()

    return (
        <section className="card">
            <h2 className="text-lg mb-2">Establecer fecha de préstamo automáticamente</h2>
            <Toggle
                labelOn="Quiero que sea automático"
                labelOff="No quiero que sea automático"
                value={fechaDePrestamoAutomatica}
                onChange={toggleFechaDePrestamoAutomatica}
            />
        </section>
    )
}
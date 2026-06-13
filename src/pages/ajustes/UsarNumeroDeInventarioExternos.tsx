import { Toggle } from "@/components"
import { useSettingsStore } from "@/store"

export function UsarNumeroDeInventarioExternos() {
    const { numerosDeInventarioExternos, toggleSetting } = useSettingsStore()

    const toggle = () => toggleSetting('numerosDeInventarioExternos')

    return (
        <section className="card">
            <h2 className="text-lg mb-2">Numeros de inventario:</h2>
            <Toggle
                labelOn="Cada libro ya tiene un número asignado en nuestro inventario y queremos digitalizar el inventario."
                labelOff="No tenemos y no necesitamos un inventario, solo necesitamos registrar los prestamos."
                value={numerosDeInventarioExternos}
                onChange={toggle}
                name="numeros-de-inventario"
            />
        </section>
    )
}

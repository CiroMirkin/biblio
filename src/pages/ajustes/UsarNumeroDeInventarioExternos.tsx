import { Toggle } from "@/components"
import type { Settings } from "@/services/settingsService"
import { useSettingsStore } from "@/store"

export function UsarNumeroDeInventarioExternos() {
    const { numerosDeInventarioExternos, toggleSetting, sugerirNuevosNumerosDeInventario } = useSettingsStore()

    const toggle = (key: keyof Settings) => toggleSetting(key)

    return (
        <section className="card flex flex-col gap-4">
            <div>
                <h2 className="text-lg mb-2">Numeros de inventario:</h2>
                <Toggle
                    labelOn="Cada libro ya tiene un número asignado en nuestro inventario y queremos digitalizar el inventario."
                    labelOff="No tenemos y no necesitamos un inventario, solo necesitamos registrar los prestamos."
                    value={numerosDeInventarioExternos}
                    onChange={() => toggle('numerosDeInventarioExternos')}
                    name="numeros-de-inventario"
                />
            </div>
            <div>
                <Toggle
                    labelOn="Permitir que el sistema sugiera el numero de inventario para un libro nuevo."
                    labelOff="No permitir sugerencias, ya que el inventario se gestiona a parte."
                    value={sugerirNuevosNumerosDeInventario}
                    onChange={() => toggle('sugerirNuevosNumerosDeInventario')}
                    name="sugerir-nuevos-numeros-de-inventario"
                />
            </div>
        </section>
    )
}

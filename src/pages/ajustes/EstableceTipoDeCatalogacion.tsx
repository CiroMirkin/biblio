import { Toggle } from "@/components"
import { useSettingsStore } from "@/store"

export function EstableceTipoDeCatalogacion() {
    const { catalogacionSimple, toggleSetting } = useSettingsStore()

    const toggle = () => toggleSetting('catalogacionSimple')

    return (
        <section className="card">
            <h2 className="text-lg mb-2">Tipo de catalogación:</h2>
            <Toggle
                labelOn="Quiero un registro de libros simple (solo N° de inventario, titulo y autor)."
                labelOff='Quiero un registro según MARC 21 (el equivalente a "catalogación rápida" en sistemas como Koha).'
                value={catalogacionSimple}
                onChange={toggle}
                name="tipo-de-catalogacion"
            />
        </section>
    )
}

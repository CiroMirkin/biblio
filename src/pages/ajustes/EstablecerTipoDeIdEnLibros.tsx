import { Toggle } from "@/components"
import { useSettingsStore } from "@/store"

export function EstablecerTipoDeIdEnLibros() {
    const { tipoDeIdEnLibros, updateSetting } = useSettingsStore()

    const setTipo = () => {
        updateSetting(
            'tipoDeIdEnLibros', 
            tipoDeIdEnLibros === 'Código de Barras'
                ? 'N° de Inventario'
                : 'Código de Barras'
        )
    }

    return (
        <section className="card">
            <h2 className="text-lg mb-2">Tipo de identificador en libros:</h2>
            <Toggle
                labelOn="Usamos un N° de inventario único de cada libro."
                labelOff="Usamos el ISBN / Código de barras que tienen los libros."
                value={tipoDeIdEnLibros === 'N° de Inventario'}
                onChange={setTipo}
                name="tipo-id-libros"
            />
        </section>
    )
}

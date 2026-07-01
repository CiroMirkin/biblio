import { useSettingsStore, useSociosStore } from "@/store"
import { GestionEstadoSocio } from "./GestionEstadoSocio"

export function ExplicacionSocioInactivo() {
    const { socioSeleccionado } = useSociosStore()
    const { maximoDeCuotasAdeudadas, gestionDeCuotas } = useSettingsStore()
    const nombre = socioSeleccionado?.nombreYApellido || ""
    return (
        <section className="card">
            <div className="flex flex-col gap-px mb-4 opacity-75 text-lg tracking-normal">
                { gestionDeCuotas &&
                    <p>Este socio esta inactivo, la causa puede ser la adeuda de {maximoDeCuotasAdeudadas} cuotas o mas.</p>
                }
                { !gestionDeCuotas &&
                    <p>Este socio esta inactivo.</p>
                }
                <p>Puedes dar de alta a { nombre.split(',').join(' ') } con el botón de abajo.</p>
            </div>
            <div className="w-8">
                <GestionEstadoSocio />
            </div>
        </section>
    )
}

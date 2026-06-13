import { useSettingsStore, useSociosStore } from "@/store"
import { GestionEstadoSocio } from "./GestionEstadoSocio"

export function ExplicacionSocioInactivo() {
    const { socioSeleccionado } = useSociosStore()
    const { maximoDeCuotasAdeudadas } = useSettingsStore()
    const nombre = socioSeleccionado?.nombreYApellido || ""
    return (
        <>
            <div className="flex flex-col gap-2 mb-2 opacity-75 text-lg tracking-normal">
                <p>Este socio esta inactivo, la causa puede ser debido a que adeuda {maximoDeCuotasAdeudadas} cuotas o mas.</p>
                <p>Puedes dar de alta a {nombre} con el botón de abajo solo si esta al dia con sus cuotas.</p>
            </div>
            <div className="w-8">
                <GestionEstadoSocio />
            </div>
        </>
    )
}

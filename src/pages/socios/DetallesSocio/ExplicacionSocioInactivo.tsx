import { useSociosStore } from "@/store"
import { GestionEstadoSocio } from "./GestionEstadoSocio"

export function ExplicacionSocioInactivo() {
    const { maximoDeCuotasAdeudadas, socioSeleccionado } = useSociosStore()
    const nombre = socioSeleccionado?.nombreYApellido || ""
    return (
        <>
            <div className="flex flex-col gap-2 mb-2 opacity-75 text-lg tracking-normal">
                <p>Este socio esta inactivo debido a que adeuda {maximoDeCuotasAdeudadas} cuotas o mas.</p>
                <p>{nombre} volverá a estar de alta automáticamente cuando este al dia con sus cuotas o puedes darle de alta manualmente con el botón de abajo.</p>
            </div>
            <div className="w-8">
                <GestionEstadoSocio />
            </div>
        </>
    )
}
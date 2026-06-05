import type { CaracterSocio } from "./Socio"

interface Data {
    estado: boolean
    caracter: CaracterSocio
    tieneCuotasDesactualizadas: boolean
}

export const getCaracterSocio = (caracter: string | undefined): Data => {
    const caracterSocio: string = caracter || ""

    // El string vacio se toma como regular, 
    // por cuestiones de migracion, en el archivo original solo especificaba si estaba dado de baja
    
    const estado = [
        "regular",
        "",
        "regular-automatico",
        "cuotas-desactualizadas",
    ].includes(caracterSocio.trim().toLowerCase())
    
    return ({
        tieneCuotasDesactualizadas: caracterSocio === "cuotas-desactualizadas",
        estado,
        caracter: estado ? "Regular" : "Inactivo",
    })
}
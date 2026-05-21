
interface Data {
    estado: boolean
    caracter: "Regular" | "Inactivo"
}

export const getCaracterSocio = (caracter: string | undefined): Data => {
    const caracterSocio: string = caracter || ""
    const estado = ["regular", ""].includes(caracterSocio.trim().toLowerCase() || "")

    return ({
        estado,
        caracter: estado ? "Regular" : "Inactivo",
    })
}
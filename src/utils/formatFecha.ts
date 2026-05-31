import { format } from "@formkit/tempo"

/** @returns DD/MM/AA */
export const formatFecha = (fecha: Date | null): string => {
    try {
        if (fecha === null) return ""
        
        return format(fecha, "short")
    }
    catch {
        return ""
    }
}

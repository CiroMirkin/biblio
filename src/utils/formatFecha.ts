import { format } from "@formkit/tempo"

/** @returns DD/MM/AA */
export const formatFecha = (fecha: Date | null | undefined): string => {
    try {
        if(!fecha)  return ""
        
        return format(fecha, "short")
    }
    catch {
        return ""
    }
}


export const formatDiasRelativo = (dias: number): "Hoy" | "Ayer" | string => {
    if(dias <= 1) return dias == 0 ? "Hoy" : "Ayer"
    return `${dias} días`
}


export function formatDNI(dni: number | string): string {
    const raw = String(dni)
    if (raw.includes(".")) return raw
    
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

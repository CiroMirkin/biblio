
export function formatDNI(dni: number | string): string {
  const raw = String(dni).replace(/[.,]/g, '')
  return raw.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

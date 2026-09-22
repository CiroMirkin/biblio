// La URL de sheet-url.txt debe ser la de exportación CSV (.../export?format=csv&gid=...),
// no la de edición (.../edit?gid=...): esa última devuelve HTML, no CSV.
export function esUrlCsvSheetValida(url: string): boolean {
  try {
    const u = new URL(url)
    return u.pathname.endsWith('/export') && u.searchParams.get('format') === 'csv'
  } catch {
    return false
  }
}

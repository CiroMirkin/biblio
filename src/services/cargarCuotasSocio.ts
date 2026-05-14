
export async function cargarCuotasSocio(nroSocio: number, year: number): Promise<Record<string, boolean>[]> {
  return window.electronAPI.getCuotasSocio(nroSocio, year)
}

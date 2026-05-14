
export async function cargarCuotasSocio(nroSocio: number): Promise<Record<string, boolean>[]> {
  return window.electronAPI.getCuotasSocio(nroSocio)
}

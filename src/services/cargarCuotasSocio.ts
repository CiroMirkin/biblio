
export async function cargarCuotasSocio(
  nroSocio: number, year?: number
): Promise<{ meses: Record<string, boolean>[], anio: number }> 
{
  return window.electronAPI.getCuotasSocio(nroSocio, year)
}

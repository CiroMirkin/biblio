export {}

declare global {
  interface Window {
    electronAPI: {
      getSocios: () => Promise<Record<string, unknown>[]>
      getLibro: () => Promise<Record<string, unknown>[]>
      addLibroPrestado: (libro: Libro) => Promise<boolean>
      getLibrosPrestadosSocio: (nombreSocio: string, nroSocio: number) => Promise<Libro[]>
      getCuotasSocio: (nroSocio: number, anio: number) => Promise<Record<string, boolean>[]>
      toggleCuota: (nroSocio: number, anio: number, mesIndex: number) => Promise<boolean>
    }
  }
}
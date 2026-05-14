export {}

declare global {
  interface Window {
    electronAPI: {
      getSocios: () => Promise<Record<string, unknown>[]>
      getCuotasSocio: (nroSocio: number) => Promise<Record<string, boolean>[]>
      toggleCuota: (nroSocio: number, mesIndex: number) => Promise<boolean>
    }
  }
}
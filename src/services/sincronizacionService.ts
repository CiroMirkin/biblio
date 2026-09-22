export class SincronizacionService {
  static disponible(): Promise<boolean> {
    return window.electronAPI.sincronizacionDisponible()
  }

  static ejecutar() {
    return window.electronAPI.ejecutarSincronizacionDesdeSheets()
  }
}

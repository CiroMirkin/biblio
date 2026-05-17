
export class ExcelExportService {
  static async descargarSocios(): Promise<boolean> {
    return window.electronAPI.copiarExcel('socios')
  }

  static async descargarCuotas(): Promise<boolean> {
    return window.electronAPI.copiarExcel('cuotas')
  }

  static async descargarLibros(): Promise<boolean> {
    return window.electronAPI.copiarExcel('libros')
  }
}

import type { ImportarMrcResult } from "@/types/electron"

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

  static async descargarInventarioEnMRC(): Promise<void> {
    return window.electronAPI.obtenerArchivoMrc()
  }

  static async importarMrc(filePath: string): Promise<ImportarMrcResult> {
    return window.electronAPI.importarMrc(filePath)
  }

  static async copiaDeSeguridad(): Promise<boolean> {
    return window.electronAPI.exportarExcelCompleto()
  }
}

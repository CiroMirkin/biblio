import { getLibros, editarDatosLibro, ingresarLibro, ingresarLibroMark21 } from './libros'
import {
  devolverLibro,
  getLibrosPrestadosSocio,
  getSociosConLibros,
  addLibroPrestado
} from './prestamos'
import {
  getSocios,
  createSocio,
  darDeBajaSocio,
  reactivarSocio,
  editarDatosSocio,
  cambiarNombreSocio,
  vincularSocios,
  desvincularSocios,
  changeObservaciones,
} from './socios'
import { getCuotasSocio, toggleCuota } from './cuotas'
import { copiarExcel, type ArchivoKey } from '../utils/copiarExcel'

import type { Libro, LibroRegistrado } from "@shared/models/libro"
import type { NewSocio, Socio } from '@shared/models/socio'
import type { Marc21 } from "@shared/models/marc21"
import { descargarMrc } from '../utils/descargarMrc'
import { importarMrc } from '../utils/importarMrc'
import { exportarExcelCompleto, importarExcelCompleto } from '../utils/excelCompleto'

const librosIpcHandlers = {
  getLibros: () => getLibros(),
  addLibroPrestado: (_: unknown, libro: Libro, fecha?: Date) => addLibroPrestado(libro, fecha),
  editarDatosLibro: (_: unknown, nroInventario: number, datos: Partial<LibroRegistrado>) => editarDatosLibro(nroInventario, datos),
  ingresarLibro: (_: unknown, ingreso: Libro) => ingresarLibro(ingreso),
  ingresarLibroMark21: (_: unknown, ingreso: Marc21) => ingresarLibroMark21(ingreso),
}

const prestamosIpcHandlers = {
  devolverLibro: (_: unknown, numeroInventario: number | string) => devolverLibro(numeroInventario),
  getLibrosPrestadosSocio: (_: unknown, nroSocio: number) => getLibrosPrestadosSocio(nroSocio),
  getSociosConLibros: () => getSociosConLibros(),
}

const sociosIpcHandlers = {
  getSocios: () => getSocios(),
  createSocio: (_: unknown, socioData: NewSocio) => createSocio(socioData),
  darDeBajaSocio: (_: unknown, nroSocio: number) => darDeBajaSocio(nroSocio),
  reactivarSocio: (_: unknown, nroSocio: number) => reactivarSocio(nroSocio),
  editarDatosSocio: (_: unknown, nroSocio: number, datos: Partial<Socio>) => editarDatosSocio(nroSocio, datos),
  cambiarNombreSocio: (_: unknown, nroSocio: number, nombre: string) => cambiarNombreSocio(nroSocio, nombre),
  vincularSocios: (_: unknown, socio1: Socio, socio2: Socio) => vincularSocios(socio1, socio2),
  desvincularSocios: (_: unknown, socio1: Socio, socio2: Socio) => desvincularSocios(socio1, socio2),
  changeObservaciones: (_: unknown, obs: string, nroSocio: number) => changeObservaciones(obs, nroSocio),
}

const cuotasIpcHandlers = {
  getCuotasSocio: (_: unknown, nroSocio: number, anio?: number) => getCuotasSocio(nroSocio, anio),
  toggleCuota: (_: unknown, nroSocio: number, anio: number, mesIndex: number) => toggleCuota(nroSocio, anio, mesIndex),
}

const archivosIpcHandlers = {
  copiarExcel: (_: unknown, key: ArchivoKey) => copiarExcel(key),
  obtenerArchivoMrc: (_: unknown, excluirSinIsbn?: boolean) => descargarMrc(excluirSinIsbn),
  importarMrc: (_: unknown, filePath: string) => importarMrc(filePath),
  exportarExcelCompleto: (_: unknown) => exportarExcelCompleto(),
  importarExcelCompleto: (_: unknown) => importarExcelCompleto(),
}

export const ipcHandlers: Record<string, (...args: any[]) => unknown> = {
  ...librosIpcHandlers,
  ...prestamosIpcHandlers,
  ...sociosIpcHandlers,
  ...cuotasIpcHandlers,
  ...archivosIpcHandlers,
}

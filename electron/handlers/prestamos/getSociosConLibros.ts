import ExcelJS from 'exceljs'
import { LIBROS_XLSX_PATH } from '../../constants'
import type { Socio } from '../../socio'

type SocioConLibros = Pick<Socio, 'nombreYApellido' | 'nroSocio'>

export const getSociosConLibros =  async (): Promise<SocioConLibros[]> => {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(LIBROS_XLSX_PATH)
  const worksheet = workbook.getWorksheet('Hoja1')
  if (!worksheet) return []

  const socios: SocioConLibros[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    const nombreSocio = String(row.getCell(4).value ?? '')
    const nSocio = Number(row.getCell(5).value ?? 0)

    if(nombreSocio && nSocio) {
      const socio =  {
        nombreYApellido: nombreSocio,
        nroSocio: nSocio,
      }
      socios.push(socio as SocioConLibros)
    }
  })

  return socios
}

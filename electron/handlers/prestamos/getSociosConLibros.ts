import { getLibrosWorksheet } from '../../constants'
import type { Socio } from '@shared/models/socio'

type SocioConLibros = Pick<Socio, 'nombreYApellido' | 'nroSocio'>

export const getSociosConLibros =  async (): Promise<SocioConLibros[]> => {
  const { worksheet } = await getLibrosWorksheet()
  if (!worksheet) return []

  const socios: SocioConLibros[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    const nombreSocio = String(row.getCell(1).value ?? '')
    const nSocio = Number(row.getCell(2).value ?? 0)

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

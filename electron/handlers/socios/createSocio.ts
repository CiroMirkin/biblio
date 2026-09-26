import { getSociosWorksheet, getCuotasWorksheet } from '../../constants'
import { writeSocio } from '../../models/socio'
import type { NewSocio, Socio } from '@shared/models/socio'

export const createSocio = async (socioData: NewSocio): Promise<Socio> => {
  const { worksheet: sociosSheet, writeWorkbook: writeSocios } = await getSociosWorksheet()
  if (!sociosSheet) throw new Error('No se encontró la hoja "Hoja1"')

  let lastNroSocio = 0

  sociosSheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    const nro = Number(row.getCell(1).value)
    if (nro > lastNroSocio) lastNroSocio = nro
  })

  const newNroSocio = lastNroSocio + 1
  const newSocio: Socio = { nroSocio: newNroSocio, ...socioData }

  // INSERTA SOCIO EN REGISTRO DE SOCIOS

  const newRow = sociosSheet.addRow([])
  newRow.getCell(1).value = newNroSocio
  writeSocio(newRow, newSocio)

  await writeSocios()

  // INSERTA SOCIO EN REGISTRO DE CUOTAS

  const { worksheet: cuotasSheet, writeWorkbook: writeCuotas } = await getCuotasWorksheet()
  if (!cuotasSheet) throw new Error('No se encontró la hoja "original"')

  const newCuotasRow = cuotasSheet.addRow([])
  newCuotasRow.getCell(3).value = newNroSocio
  newCuotasRow.getCell(4).value = socioData.nombreYApellido

  await writeCuotas()

  return newSocio
}

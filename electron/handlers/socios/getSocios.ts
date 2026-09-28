import { leerSocios } from '../../constants'
import { rowToSocio } from '../../models/socio'

export const getSocios = async () => leerSocios(({ worksheet }) => {
  if (!worksheet) return []

  const socios: unknown[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    socios.push(rowToSocio(row))
  })

  return socios
})

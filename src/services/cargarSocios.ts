import ExcelJS from "exceljs"
import type { Socio } from "@/models/Socio"

export async function cargarSocios(): Promise<Socio[]> {
  const response = await fetch("/Biblio - datos de prueba.xlsx")
  const buffer = await response.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const worksheet = workbook.getWorksheet("datos_prueba_socios")
  if (!worksheet) return []

  const socios: Socio[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return

    const values = row.values as Array<string | number | Date | null | undefined>

    const telefonoRaw = values[5]
    const telefono =
      telefonoRaw && telefonoRaw !== 0 ? String(telefonoRaw) : null

    socios.push({
      nroSocio: Number(values[1]) || 0,
      nombreYApellido: String(values[2] ?? ""),
      domicilio: String(values[3] ?? ""),
      dni: Number(values[4]) || 0,
      telefono,
      nacionalidad: String(values[6] ?? ""),
      fechaNacimiento:
        values[7] instanceof Date
          ? values[7]
          : new Date(values[7] as string),
      caracterSocio: String(values[8] ?? ""),
      fechaIngresoEgreso:
        values[9] instanceof Date
          ? values[9]
          : new Date(values[9] as string),
      observaciones: String(values[10] ?? ""),
    })
  })

  return socios
}

import ExcelJS from "exceljs"

export const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

export async function cargarCuotasSocio(nroSocio: number): Promise<Record<string, boolean>[]> {
  const response = await fetch("/Biblio - datos de prueba.xlsx")
  const buffer = await response.arrayBuffer()
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(buffer)

  const worksheet = workbook.getWorksheet("datos_prueba_socios")
  if (!worksheet) return []

  let meses: Record<string, boolean>[] = []

  worksheet.eachRow((row, rowIndex) => {
    if (rowIndex === 1) return
    if (Number(row.getCell(1).value) !== nroSocio) return

    meses = MESES.map((nombre, i) => {
      const cell = row.getCell(3 + i)
      const fill = cell.fill as { type?: string; pattern?: string } | null | undefined
      const pagado = fill?.type === "pattern" && fill?.pattern === "solid"
      return { [nombre]: pagado }
    })
  })

  return meses
}

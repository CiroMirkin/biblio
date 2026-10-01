import { describe, it, expect } from 'vitest'
import ExcelJS from 'exceljs'
import { asegurarAnio, construirIndiceMeses } from '../electron/models/cuotas'

// Misma forma que el archivo real, 4 columnas de socio y luego cada año precedido de un separador
function hojaConAnios(anios: number[]) {
  const ws = new ExcelJS.Workbook().addWorksheet('original')
  const header = ws.getRow(1)
  header.getCell(3).value = 'N° Socio'
  const fila = ws.getRow(2)
  fila.getCell(3).value = 20
  anios.forEach((anio, i) => {
    for (let mes = 0; mes < 12; mes++) {
      const col = 5 + i * 13 + mes
      header.getCell(col).value = new Date(Date.UTC(anio, mes, 1))
      header.getCell(col).numFmt = 'mmm-yy'
      fila.getCell(col).value = `${anio}-${mes}`
    }
  })
  return ws
}

const columnas = (ws: ExcelJS.Worksheet) => [...construirIndiceMeses(ws.getRow(1))]
  .map(([col, { anio, mes }]) => ({ col, anio, mes }))

describe('asegurarAnio', () => {
  it('Agrega el año siguiente y borra el más viejo conservando 3 años y la forma del archivo', () => {
    const ws = hojaConAnios([2024, 2025, 2026])

    asegurarAnio(ws, 2027)

    const cols = columnas(ws)
    expect([...new Set(cols.map(c => c.anio))]).toEqual([2025, 2026, 2027])
    expect(cols.find(c => c.anio === 2025 && c.mes === 0)!.col).toBe(5)
    expect(cols.find(c => c.anio === 2027 && c.mes === 0)!.col).toBe(31)
    expect(cols.find(c => c.anio === 2027 && c.mes === 11)!.col).toBe(42)
    expect(ws.getRow(2).getCell(5).value).toBe('2025-0')
    expect(ws.getRow(2).getCell(18).value).toBe('2026-0')
    expect(ws.getRow(2).getCell(31).value).toBeNull()
    expect(ws.getRow(1).getCell(31).numFmt).toBe('mmm-yy')
  })

  it('No borra ningún año si hay menos de 3', () => {
    const ws = hojaConAnios([2025, 2026])

    asegurarAnio(ws, 2027)

    expect([...new Set(columnas(ws).map(c => c.anio))]).toEqual([2025, 2026, 2027])
    expect(ws.getRow(2).getCell(5).value).toBe('2025-0')
  })

  it('Completa los años salteados', () => {
    const ws = hojaConAnios([2024, 2025, 2026])

    asegurarAnio(ws, 2028)

    expect([...new Set(columnas(ws).map(c => c.anio))]).toEqual([2026, 2027, 2028])
    expect(ws.getRow(2).getCell(5).value).toBe('2026-0')
  })

  it('No toca el archivo si el año ya existe o es anterior', () => {
    const ws = hojaConAnios([2024, 2025, 2026])

    asegurarAnio(ws, 2026)
    asegurarAnio(ws, 2020)

    expect([...new Set(columnas(ws).map(c => c.anio))]).toEqual([2024, 2025, 2026])
  })
})

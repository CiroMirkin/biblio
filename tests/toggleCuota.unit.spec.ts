import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMockRow, createMockWorksheet, createMockWorkbook, mockExcelJS } from './mocks/exceljs'

vi.mock('exceljs', async () => {
  const { mockExcelJS } = await import('./mocks/exceljs')
  return { default: mockExcelJS }
})

import { toggleCuota } from '../electron/handlers/toggleCuota'

describe('toggleCuota (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Cambia el estado de pago de una cuota existente (pago -> adeuda)', async () => {
    const headerRow = createMockRow({ 5: new Date('2026-01-15') })
    const dataRow = createMockRow({ 3: 20, 5: 'pago' })
    const worksheet = createMockWorksheet(headerRow, [dataRow])
    const workbook = createMockWorkbook(worksheet)
    mockExcelJS.Workbook.mockImplementation(function () { return workbook })

    const result = await toggleCuota(20, 2026, 0)

    expect(result).toBe(false)
    expect(dataRow.getCell(5).value).toBe('adeuda')
    expect(workbook.xlsx.writeFile).toHaveBeenCalledOnce()
  })

  it('Cambia el estado de pago de una cuota existente (adeuda -> pago)', async () => {
    const headerRow = createMockRow({ 5: new Date('2026-01-15') })
    const dataRow = createMockRow({ 3: 20, 5: 'adeuda' })
    const worksheet = createMockWorksheet(headerRow, [dataRow])
    const workbook = createMockWorkbook(worksheet)
    mockExcelJS.Workbook.mockImplementation(function () { return workbook })

    const result = await toggleCuota(20, 2026, 0)

    expect(result).toBe(true)
    expect(dataRow.getCell(5).value).toBe('pago')
    expect(workbook.xlsx.writeFile).toHaveBeenCalledOnce()
  })

  it('Lanza error si el socio no existe', async () => {
    const headerRow = createMockRow({ 5: new Date('2026-01-15') })
    const dataRow = createMockRow({ 3: 20, 5: 'pago' })
    const worksheet = createMockWorksheet(headerRow, [dataRow])
    const workbook = createMockWorkbook(worksheet)
    mockExcelJS.Workbook.mockImplementation(function () { return workbook })

    await expect(toggleCuota(99999, 2026, 0)).rejects.toThrow('Socio 99999 no encontrado')
  })

  it('Lanza error si el mes no existe en el archivo', async () => {
    const headerRow = createMockRow({ 5: new Date('2026-01-15') })
    const dataRow = createMockRow({ 3: 20, 5: 'pago' })
    const worksheet = createMockWorksheet(headerRow, [dataRow])
    const workbook = createMockWorkbook(worksheet)
    mockExcelJS.Workbook.mockImplementation(function () { return workbook })

    await expect(toggleCuota(20, 2021, 30)).rejects.toThrow('Mes 31/2021 no encontrado en el archivo')
  })
})

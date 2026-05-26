import { vi } from 'vitest'
import type ExcelJS from 'exceljs'

export function createMockCell(initialValue: unknown = undefined) {
  return { value: initialValue }
}

export function createMockRow(cellValues: Record<number, unknown> = {}) {
  const cells: Record<number, { value: unknown }> = {}
  for (const [key, val] of Object.entries(cellValues)) {
    cells[Number(key)] = createMockCell(val)
  }

  return {
    getCell: vi.fn((colIndex: number) => {
      if (!cells[colIndex]) {
        cells[colIndex] = createMockCell()
      }
      return cells[colIndex]
    }) as unknown as ExcelJS.Row['getCell'],
    
    eachCell: vi.fn(function (
      this: unknown,
      options: { includeEmpty?: boolean },
      callback?: (cell: ExcelJS.Cell, colIndex: number) => void,
    ) {
      const cb = callback || (options as unknown as (cell: ExcelJS.Cell, colIndex: number) => void)
      Object.entries(cells).forEach(([idx, cell]) => {
        cb(cell as unknown as ExcelJS.Cell, Number(idx))
      })
    }) as unknown as ExcelJS.Row['eachCell'],
  } as unknown as ExcelJS.Row
}

export function createMockWorksheet(
  headerRow?: ExcelJS.Row,
  dataRows: Array<Record<number, unknown>> = [],
) {
  const rows: Array<ExcelJS.Row | undefined> = [undefined]
  rows.push(headerRow || (createMockRow() as unknown as ExcelJS.Row))
  dataRows.forEach((cells) => {
    rows.push(createMockRow(cells) as unknown as ExcelJS.Row)
  })

  return {
    getRow: vi.fn((rowIndex: number) => {
      if (!rows[rowIndex]) {
        rows[rowIndex] = createMockRow() as unknown as ExcelJS.Row
      }
      return rows[rowIndex]!
    }),
    eachRow: vi.fn((callback: (row: ExcelJS.Row, rowIndex: number) => void) => {
      rows.forEach((row, index) => {
        if (row && index >= 1) callback(row, index)
      })
    }),
  } as unknown as ExcelJS.Worksheet
}

export function createMockWorkbook(worksheet?: ExcelJS.Worksheet) {
  const ws = worksheet || (createMockWorksheet() as unknown as ExcelJS.Worksheet)
  return {
    xlsx: {
      readFile: vi.fn().mockResolvedValue(undefined),
      writeFile: vi.fn().mockResolvedValue(undefined),
    },
    getWorksheet: vi.fn((_name: string) => ws),
  } as unknown as ExcelJS.Workbook
}

export const mockExcelJS = {
  Workbook: vi.fn(() => createMockWorkbook()),
}

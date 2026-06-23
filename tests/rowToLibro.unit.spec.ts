import { describe, it, expect } from 'vitest'
import ExcelJS from 'exceljs'
import { rowToLibro } from '../electron/models/libro'

const crearRow = (celdas: Record<number, unknown>): ExcelJS.Row => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Hoja1')
    const row = worksheet.getRow(1)
    for (const [col, value] of Object.entries(celdas)) {
        row.getCell(Number(col)).value = value as ExcelJS.CellValue
    }
    return row
}

describe('rowToLibro', () => {
    it('Retorna un Marc21EnPrestamo cuando la fila contiene itemType y holding validos', () => {
        const fecha = new Date('2024-06-01')

        const row = crearRow({
            1:  'Juan Perez',
            2:  42,
            3:  fecha,
            4:  'Gabriel Garcia Marquez',
            5:  'Cien anos de soledad',
            6:  '555555',
            7:  'BK',
            8:  'f',
            9:  '2da',
            10: 'Buenos Aires',
            11: 'Sudamericana',
            12: '1967',
            13: 'Central',
            14: 'Deposito',
            15: 'Buen estado',
            16: 'COL-001',
        })

        const result = rowToLibro(row)

        expect(result).toMatchObject({
            nombreSocio:       'Juan Perez',
            numeroSocio:       42,
            fechaDePrestamo:   fecha,
            autor:             'Gabriel Garcia Marquez',
            titulo:            'Cien anos de soledad',
            numeroInventario:  '555555',
            itemType:          'BK',
            literaryForm:      'f',
            edition:           '2da',
            placeOfPublication:'Buenos Aires',
            publisher:         'Sudamericana',
            publicationYear:   '1967',
            holding: {
                barcode:       '555555',
                homeBranch:    'Central',
                holdingBranch: 'Deposito',
                publicNote:    'Buen estado',
                callNumber:    'COL-001',
            },
        })
    })

    it('Retorna un LibroEnPrestamo cuando la fila no tiene itemType ni holding validos', () => {
        const fecha = new Date('2024-07-15')

        const row = crearRow({
            1: 'Maria Lopez',
            2: 7,
            3: fecha,
            4: 'Julio Cortazar',
            5: 'Rayuela',
            6: '100001',
        })

        const result = rowToLibro(row)

        expect(result).toEqual({
            nombreSocio:      'Maria Lopez',
            numeroSocio:      7,
            fechaDePrestamo:  fecha,
            autor:            'Julio Cortazar',
            titulo:           'Rayuela',
            numeroInventario: '100001',
        })
        expect('itemType' in result).toBe(false)
        expect('holding' in result).toBe(false)
    })

    it('Los campos opcionales de Marc21 son undefined cuando las celdas estan vacias', () => {
        const row = crearRow({
            5:  'Ficciones',
            6:  '777777',
            7:  'BK',
            13: 'Central',
            14: 'Central',
        })

        const result = rowToLibro(row)

        expect('itemType' in result).toBe(true)
        expect((result as any).literaryForm).toBeUndefined()
        expect((result as any).edition).toBeUndefined()
        expect((result as any).placeOfPublication).toBeUndefined()
        expect((result as any).publisher).toBeUndefined()
        expect((result as any).publicationYear).toBeUndefined()
        expect((result as any).holding.publicNote).toBeUndefined()
        expect((result as any).holding.callNumber).toBeUndefined()
    })

    it('Parsea la fecha correctamente cuando la celda contiene un string en lugar de un Date', () => {
        const row = crearRow({
            5:  'El Aleph',
            6:  '888888',
            7:  'BK',
            3:  '2024-09-20',
            13: 'Central',
            14: 'Central',
        })

        const result = rowToLibro(row)

        expect((result as any).fechaDePrestamo).toBeInstanceOf(Date)
        expect((result as any).fechaDePrestamo.getFullYear()).toBe(2024)
    })

    it('Retorna fechaDePrestamo null cuando la celda de fecha esta vacia', () => {
        const row = crearRow({
            5:  'Bestiario',
            6:  '999999',
            7:  'BK',
            13: 'Central',
            14: 'Central',
        })

        const result = rowToLibro(row)

        expect((result as any).fechaDePrestamo).toBeNull()
    })
})
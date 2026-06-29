import { describe, it, expect } from 'vitest'
import ExcelJS from 'exceljs'
import { writeLibro } from '../electron/models/libro'
import type { CallNumber, Marc21EnPrestamo } from "@shared/models"

const crearRowEnBlanco = (): ExcelJS.Row => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Hoja1')
    return worksheet.getRow(1)
}

const callNumber: CallNumber = { dewey: '863', cutter: 'AVE' }
const callNumberConPrefijo: CallNumber = { prefix: 'A', dewey: '863', cutter: 'AGU' }
const callNumberConVolumen: CallNumber = { dewey: '982', cutter: 'COO', volume: 'v.2' }

describe('writeLibro', () => {
    it('Escribe un Marc21EnPrestamo en las columnas que corresponden segun el mapeo', () => {
        const row = crearRowEnBlanco()

        const libro: Marc21EnPrestamo = {
            titulo: 'Cien anos de soledad',
            autor: 'Gabriel Garcia Marquez',
            numeroInventario: 1001,
            itemType: 'BK',
            literaryForm: 'f',
            edition: '2da',
            placeOfPublication: 'Buenos Aires',
            publisher: 'Sudamericana',
            authorCountry: 'Colombia',
            publicationYear: '1967',
            holding: {
                barcode: '1002',
                homeBranch: 'Central',
                holdingBranch: 'Deposito',
                publicNote: 'Buen estado',
                callNumber,
            },
            nombreSocio: 'Juan Perez',
            numeroSocio: 42,
            fechaDePrestamo: new Date('2024-06-01'),
        }

        writeLibro(row, libro)

        expect(row.getCell(1).value).toBe(libro.nombreSocio)
        expect(row.getCell(2).value).toBe(libro.numeroSocio)
        expect(row.getCell(3).value).toEqual(libro.fechaDePrestamo)
        expect(row.getCell(4).value).toBe(libro.autor)
        expect(row.getCell(5).value).toBe(libro.titulo)
        expect(row.getCell(6).value).toBe(libro.numeroInventario)
        expect(row.getCell(7).value).toBe(libro.itemType)
        expect(row.getCell(8).value).toBe(libro.literaryForm)
        expect(row.getCell(9).value).toBe(libro.edition)
        expect(row.getCell(10).value).toBe(libro.placeOfPublication)
        expect(row.getCell(11).value).toBe(libro.publisher)
        expect(row.getCell(12).value).toBe(libro.publicationYear)
        expect(row.getCell(13).value).toBe(libro.holding.homeBranch)
        expect(row.getCell(14).value).toBe(libro.holding.holdingBranch)
        expect(row.getCell(15).value).toBe(libro.holding.publicNote)
        expect(row.getCell(16).value).toBe('863 AVE')
        expect(row.getCell(17).value).toBe(libro.authorCountry)
        expect(row.getCell(18).value).toBe(libro.holding.barcode)
    })

    it('Escribe el callNumber con prefijo correctamente', () => {
        const row = crearRowEnBlanco()

        const libro: Marc21EnPrestamo = {
            titulo: 'El Aleph',
            itemType: 'BK',
            holding: {
                barcode: '111111',
                homeBranch: 'Central',
                holdingBranch: 'Central',
                callNumber: callNumberConPrefijo,
            },
            nombreSocio: 'Ana Gomez',
            numeroSocio: 1,
            fechaDePrestamo: new Date('2024-01-01'),
        }

        writeLibro(row, libro)

        expect(row.getCell(16).value).toBe('A863 AGU')
    })

    it('Escribe el callNumber con volumen correctamente', () => {
        const row = crearRowEnBlanco()

        const libro: Marc21EnPrestamo = {
            titulo: 'Historia Universal',
            itemType: 'BK',
            holding: {
                barcode: '222222',
                homeBranch: 'Central',
                holdingBranch: 'Central',
                callNumber: callNumberConVolumen,
            },
            nombreSocio: 'Luis Torres',
            numeroSocio: 2,
            fechaDePrestamo: new Date('2024-02-01'),
        }

        writeLibro(row, libro)

        expect(row.getCell(16).value).toBe('982 COO v.2')
    })

    it('No escribe en celdas cuyos campos opcionales no fueron especificados', () => {
        const row = crearRowEnBlanco()

        const libro: Marc21EnPrestamo = {
            titulo: 'Rayuela',
            itemType: 'BK',
            holding: {
                barcode: '666666',
                homeBranch: 'Central',
                holdingBranch: 'Central',
                callNumber: {
                    dewey: "863",
                    cutter: "COR",
                },
            },
            nombreSocio: 'Maria Lopez',
            numeroSocio: 7,
            fechaDePrestamo: new Date('2024-07-01'),
        }

        writeLibro(row, libro)

        expect(row.getCell(4).value).toBeNull()
        expect(row.getCell(8).value).toBeNull()
        expect(row.getCell(9).value).toBeNull()
        expect(row.getCell(10).value).toBeNull()
        expect(row.getCell(11).value).toBeNull()
        expect(row.getCell(12).value).toBeNull()
        expect(row.getCell(15).value).toBeNull()
        expect(row.getCell(17).value).toBeNull()
    })

    it('Solo sobreescribe las celdas de los campos especificados y deja intactas las demas', () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Hoja1')
        const row = worksheet.getRow(1)

        row.getCell(4).value = 'Autor Previo'
        row.getCell(9).value = 'Edicion Previa'
        row.getCell(11).value = 'Editorial Previa'

        const libro: Marc21EnPrestamo = {
            titulo: 'Ficciones',
            itemType: 'BK',
            holding: {
                barcode: '777777',
                homeBranch: 'Central',
                holdingBranch: 'Central',
                callNumber: {
                    dewey: "863",
                    cutter: "BOR",
                },
            },
            autor: 'Jorge Luis Borges',
            nombreSocio: 'Carlos Ruiz',
            numeroSocio: 5,
            fechaDePrestamo: new Date('2024-08-01'),
        }

        writeLibro(row, libro)

        expect(row.getCell(4).value).toBe('Jorge Luis Borges')
        expect(row.getCell(9).value).toBe('Edicion Previa')
        expect(row.getCell(11).value).toBe('Editorial Previa')
    })
})
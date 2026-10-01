import { describe, it, expect } from 'vitest'
import { calcularCallNumber, type Libro } from '@shared/models'
import { libroDesdeLibroForm } from '@/components/libroDesdeLibroForm'
import { libroDesdeMarc21Form } from '@/components/libroDesdeMarc21Form'

const guardado = (datos: Partial<Libro>): Libro => ({
    titulo: 'Rayuela',
    autor: 'Cortazar, Julio',
    holding: { homeBranch: 'Central', holdingBranch: 'Central' },
    ...datos,
})

describe('libroDesdeLibroForm', () => {
    it('Formatea titulo y autor y usa forma literaria desconocida por defecto', () => {
        expect(libroDesdeLibroForm({ titulo: ' rayuela ', autor: 'cortazar, julio', literaryForm: '' })).toEqual({
            titulo: 'Rayuela',
            autor: 'Cortazar, Julio',
            literaryForm: 'u',
            literaryGenres: '',
            authorCountry: '',
            holding: { publicNote: '' },
        })
    })

    it('Toma nacionalidad y observaciones opcionales', () => {
        const libro = libroDesdeLibroForm({ titulo: 'Rayuela', callNumberPrefix: 'argentino', publicNote: 'tapa rota' })

        expect(libro.authorCountry).toBe('Argentina')
        expect(libro.holding?.publicNote).toBe('Tapa rota')
    })

    it('Al editar, un autor vacio conserva el autor guardado', () => {
        expect(libroDesdeLibroForm({ titulo: 'Rayuela', autor: '' }, guardado({})).autor).toBe('Cortazar, Julio')
    })

    it('Al ingresar, un autor vacio queda vacio', () => {
        expect(libroDesdeLibroForm({ titulo: 'Rayuela', autor: '' }).autor).toBe('')
    })
})

describe('libroDesdeMarc21Form', () => {
    const campos = {
        titulo: 'rayuela',
        autor: 'Cortazar, Julio',
        callNumberPrefix: 'argentina',
        dewey: '863',
        barcode: '9789500720915',
        publicNote: 'primera edicion',
    }

    it('No incluye sede ni itemType', () => {
        const libro = libroDesdeMarc21Form(campos)

        expect(libro).not.toHaveProperty('itemType')
        expect(libro.holding).not.toHaveProperty('homeBranch')
        expect(libro.holding).not.toHaveProperty('holdingBranch')
    })

    it('Calcula la signatura igual que la que muestra el formulario', () => {
        expect(libroDesdeMarc21Form(campos).holding?.callNumber).toBe(calcularCallNumber('argentina', '863', 'Cortazar, Julio'))
    })

    it('Al editar un libro que ya tenia signatura usa la escrita a mano', () => {
        const libro = libroDesdeMarc21Form({ ...campos, callNumber: 'A863 COR v.2' }, guardado({ holding: { homeBranch: '', holdingBranch: '', callNumber: 'A863 COR' } }))

        expect(libro.holding?.callNumber).toBe('A863 COR v.2')
    })

    it('Un Dewey vacio queda undefined y no NaN', () => {
        expect(libroDesdeMarc21Form({ ...campos, dewey: '' }).dewey).toBeUndefined()
    })

    it('Descarta un ISBN invalido', () => {
        expect(libroDesdeMarc21Form({ ...campos, barcode: '123' }).holding?.barcode).toBe('')
    })
})

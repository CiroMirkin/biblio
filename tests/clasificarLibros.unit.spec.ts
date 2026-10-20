import { describe, it, expect } from 'vitest'
import type { LibroRegistrado } from '@shared/models'
import { clasificarLibros } from '@/store/clasificarLibros'

const haceDias = (dias: number) => {
    const fecha = new Date()
    fecha.setDate(fecha.getDate() - dias)
    return fecha
}

const libro = (numeroInventario: number, titulo: string, fechaDePrestamo: Date | null) => ({
    numeroInventario,
    titulo,
    autor: '',
    fechaDePrestamo,
    holding: { homeBranch: '', holdingBranch: '' },
}) as unknown as LibroRegistrado

const disponible = libro(1, 'Rayuela', null)
const prestado = libro(2, 'Ficciones', haceDias(3))
const vencidoViejo = libro(3, 'El Aleph', haceDias(40))
const vencidoReciente = libro(4, 'Sobre heroes y tumbas', haceDias(20))
const libros = [disponible, prestado, vencidoViejo, vencidoReciente]

describe('clasificarLibros', () => {
    it('Separa disponibles, prestados y vencidos segun el limite de dias', () => {
        const { disponibles, prestados, vencidos } = clasificarLibros(libros, 15)

        expect(disponibles).toEqual([disponible])
        expect(prestados).toEqual([prestado])
        expect(vencidos).toEqual([vencidoReciente, vencidoViejo])
    })

    it('Sin busqueda los filtrados son los vencidos', () => {
        expect(clasificarLibros(libros, 15).filtrados).toEqual([vencidoReciente, vencidoViejo])
    })

    it('Un libro devuelto sigue en los resultados de la busqueda', () => {
        const devuelto = { ...prestado, fechaDePrestamo: null }
        const { filtrados } = clasificarLibros([disponible, devuelto, vencidoViejo, vencidoReciente], 15, 'ficciones')

        expect(filtrados).toEqual([devuelto])
    })
})

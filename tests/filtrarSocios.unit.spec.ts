import { describe, it, expect } from 'vitest'
import type { LibroRegistrado, Socio } from '@shared/models'
import { filtrarSocios } from '@/store/useSociosFiltrados'

const socios = [
    { nroSocio: 1, nombreYApellido: 'Gomez, Ana' },
    { nroSocio: 2, nombreYApellido: 'Perez, Juan' },
] as Socio[]

const libro = (numeroSocio: number | null) =>
    ({ titulo: 'Rayuela', numeroSocio, holding: { homeBranch: '', holdingBranch: '' } }) as LibroRegistrado

describe('filtrarSocios', () => {
    it('Sin busqueda muestra los socios con libros prestados', () => {
        const { sociosConLibros, filtrados } = filtrarSocios(socios, [libro(2), libro(null)])

        expect(sociosConLibros).toEqual([socios[1]])
        expect(filtrados).toEqual([socios[1]])
    })

    it('Un prestamo o una devolucion se reflejan en los socios con libros', () => {
        expect(filtrarSocios(socios, [libro(1)]).sociosConLibros).toEqual([socios[0]])
        expect(filtrarSocios(socios, [libro(null)]).sociosConLibros).toEqual([])
    })

    it('Con busqueda busca entre todos los socios', () => {
        expect(filtrarSocios(socios, [libro(2)], 'gomez').filtrados).toEqual([socios[0]])
    })
})

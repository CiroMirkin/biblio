import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { getCuotasSocio } from '../electron/handlers/cuotas/getCuotasSocio'
import { CUOTAS_XLSX_PATH, MESES } from '../electron/constants'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURE_PATH = path.join(__dirname, 'fixtures', 'cuotas-template.xlsx')

describe('getCuotasSocio (integration)', () => {
    beforeEach(() => {
        fs.copyFileSync(FIXTURE_PATH, CUOTAS_XLSX_PATH)
    })

    afterEach(() => {
        if (fs.existsSync(CUOTAS_XLSX_PATH)) {
            fs.rmSync(CUOTAS_XLSX_PATH, { force: true })
        }
    })

    describe('con año explícito', () => {
        it('retorna los meses del año solicitado con los pagos correctos para el socio 7', async () => {
            const result = await getCuotasSocio(7, 2026)

            expect(result).toHaveProperty('anio', 2026)
            expect(result).toHaveProperty('meses')

            const meses = (result as { meses: Record<string, boolean>[]; anio: number }).meses
            expect(meses).toHaveLength(12)

            const pagados = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio']
            const adeudados = MESES.filter(m => !pagados.includes(m))

            for (const nombre of pagados) {
                const entrada = meses.find(m => nombre in m)
                expect(entrada, `${nombre} deberia estar pagado`).toBeDefined()
                expect(entrada![nombre]).toBe(true)
            }

            for (const nombre of adeudados) {
                const entrada = meses.find(m => nombre in m)
                expect(entrada, `${nombre} deberia estar adeudado`).toBeDefined()
                expect(entrada![nombre]).toBe(false)
            }
        }, 30000)

        it('retorna todos los meses como false si el socio no tiene pagos en el año solicitado', async () => {
            const result = await getCuotasSocio(3, 2026)

            expect(result).toHaveProperty('anio', 2026)

            const meses = (result as { meses: Record<string, boolean>[]; anio: number }).meses
            const todosAdeudados = meses.every(m => Object.values(m)[0] === false)
            expect(todosAdeudados).toBe(true)
        }, 30000)
    })

    describe('sin año explícito (detección automática)', () => {
        it('detecta el año con pagos para el socio 7', async () => {
            const result = await getCuotasSocio(7)

            expect(result).toHaveProperty('anio', 2026)
            expect(result).toHaveProperty('meses')

            const { meses } = result as { meses: Record<string, boolean>[]; anio: number }
            const tienePagos = meses.some(m => Object.values(m)[0] === true)
            expect(tienePagos).toBe(true)
        }, 30000)

        it('detecta automáticamente el último año con pagos del socio', async () => {
            const resultAutomatico = await getCuotasSocio(3)
            const resultAnioSiguiente = await getCuotasSocio(3, 2026)
 
            expect(resultAutomatico).toHaveProperty('anio', 2025)
            expect(resultAutomatico).toHaveProperty('meses')
 
            const { meses: meses2025 } = resultAutomatico as {
                meses: Record<string, boolean>[]; anio: number
            }
            const { meses: meses2026 } = resultAnioSiguiente as {
                meses: Record<string, boolean>[]; anio: number
            }
 
            const tienePagosEn2025 = meses2025.some(m => Object.values(m)[0] === true)
            expect(tienePagosEn2025).toBe(true)
 
            const sinPagosEn2026 = meses2026.every(m => Object.values(m)[0] === false)
            expect(sinPagosEn2026).toBe(true)
        }, 30000)

        it('retorna meses vacio para un numero de socio inexistente', async () => {
            const result = await getCuotasSocio(999999)

            const { meses } = result as { meses: Record<string, boolean>[]; anio: number }
            expect(meses).toHaveLength(0)
        }, 30000)
    })
})
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createSocio } from '../electron/handlers/socios/createSocio'
import { getCuotasSocio } from '../electron/handlers/cuotas/getCuotasSocio'
import { darDeBajaSocio } from '../electron/handlers/socios/darDeBajaSocio'
import { getSocios } from '../electron/handlers/socios/getSocios'
import { SOCIOS_XLSX_PATH, CUOTAS_XLSX_PATH } from '../electron/constants'
import { useSociosStore } from '@/store/useSociosStore'
import { getCaracterSocio } from '@/models'
import { formatFecha } from '@/utils/formatFecha'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('Inscripcion de un socio', () => {
    beforeEach(() => {
        fs.copyFileSync(path.join(__dirname, 'fixtures', 'socios-template.xlsx'), SOCIOS_XLSX_PATH)
        fs.copyFileSync(path.join(__dirname, 'fixtures', 'cuotas-template.xlsx'), CUOTAS_XLSX_PATH)
        ;(globalThis as any).window = {
            electronAPI: { createSocio, getCuotasSocio, darDeBajaSocio },
        }
    })

    afterEach(() => {
        fs.rmSync(SOCIOS_XLSX_PATH, { force: true })
        fs.rmSync(CUOTAS_XLSX_PATH, { force: true })
    })

    it('El socio recien inscripto sigue activo al seleccionarlo', async () => {
        const store = useSociosStore.getState()
        const nuevo = await store.crearSocio({
            nombreYApellido: 'Nuevo, Socio',
            domicilio: '',
            dni: 1,
            fechaNacimiento: null,
            telefono: '',
            caracterSocio: '',
            fechaIngreso: formatFecha(new Date()),
            fechaEgreso: null,
            observaciones: '',
            email: '',
            sociosVinculados: [],
        })

        await useSociosStore.getState().prepararSocio(nuevo!.nroSocio)

        const guardado = (await getSocios() as any[]).find(s => s.nroSocio === nuevo!.nroSocio)!
        expect(getCaracterSocio(guardado.caracterSocio).estado).toBe(true)
    }, 30000)
})

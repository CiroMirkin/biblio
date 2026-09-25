import { test as base, expect, _electron as electron, type ElectronApplication, type Page } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { SettingsSchema } from '../../electron/settings'

const ROOT = path.join(__dirname, '..', '..')
const FIXTURES = path.join(ROOT, 'tests', 'fixtures')
const ARCHIVOS = ['socios', 'cuotas', 'libros', 'prestamos-historial']

export const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

type Fixtures = {
    ajustes: Partial<SettingsSchema>
    abrirApp: () => Promise<Page>
    page: Page
    /** cierra la app y la vuelve a abrir con los mismos archivos y ajustes */
    reabrirApp: () => Promise<Page>
}

// cada test abre la app con copias nuevas de las fixtures
// 'ajustes' se escribe en el settings.json de electron-store antes de abrir la app
export const test = base.extend<Fixtures>({
    ajustes: [{}, { option: true }],
    abrirApp: async ({ ajustes }, use) => {
        for (const nombre of ARCHIVOS) {
            fs.copyFileSync(path.join(FIXTURES, `${nombre}-template.xlsx`), path.join(FIXTURES, `${nombre}-test.xlsx`))
        }
        // userData aislado - ajustes propios y sin tocar los de la app instalada
        const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'biblio-e2e-'))
        fs.writeFileSync(path.join(userData, 'settings.json'), JSON.stringify(ajustes))

        let app: ElectronApplication | undefined
        await use(async () => {
            await app?.close()
            app = await electron.launch({
                args: [ROOT, `--user-data-dir=${userData}`],
                cwd: ROOT,
                env: { ...process.env, IS_TEST: 'true' },
            })
            return app.firstWindow()
        })

        await app?.close()
        fs.rmSync(userData, { recursive: true, force: true })
        for (const nombre of ARCHIVOS) fs.rmSync(path.join(FIXTURES, `${nombre}-test.xlsx`), { force: true })
    },
    page: async ({ abrirApp }, use) => use(await abrirApp()),
    reabrirApp: async ({ abrirApp, page: _page }, use) => use(abrirApp),
})

export { expect }

export async function inscribir(page: Page, apellido: string, nombre: string) {
    await page.getByRole('button', { name: 'Inscripción' }).click()
    await page.locator('#apellidos').fill(apellido)
    await page.locator('#nombres').fill(nombre)
    await page.locator('#telefono').fill('1122334455')
    await page.getByRole('button', { name: 'Inscribir' }).click()
    await expect(page.getByText('Socio creado exitosamente')).toBeVisible()
}

export async function abrirSocio(page: Page, apellido: string) {
    await page.getByRole('button', { name: /^Socios/ }).click()
    // esperar a que carguen los socios, si no la búsqueda corre sobre la lista vacía
    await expect(page.getByText(/Total de socios: *[1-9]/)).toBeVisible()
    const buscador = page.getByPlaceholder('Escribe aquí el apellido o nombre del socio')
    // el texto queda en sessionStorage pero la lista se resetea: vaciar para disparar la búsqueda
    await buscador.fill('')
    await buscador.fill(apellido)
    await page.getByText(apellido).click()
    await expect(page.getByRole('heading', { name: 'Libros en Préstamo' })).toBeVisible()
}

export async function volverALista(page: Page) {
    await page.getByText('Volver a la lista de socios').click()
}

export const cardPrestamos = (page: Page) =>
    page.locator('.card', { has: page.getByRole('heading', { name: 'Libros en Préstamo' }) })

// fila de un libro ya prestado (las filas vacías tienen los datos en inputs, no como texto)
export const filaPrestamo = (page: Page, titulo: string) =>
    cardPrestamos(page).locator('div.py-3', { hasText: titulo })

// celda con la fecha del préstamo (tiene title "… hace N dias" y data-vencido)
export const fechaPrestamo = (page: Page, titulo: string) =>
    filaPrestamo(page, titulo).locator('[data-vencido]')

export async function prestarLibro(page: Page, nroInventario: string, titulo: string) {
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill(nroInventario)
    await card.getByPlaceholder('N°').first().press('Enter')
    await expect(card.getByPlaceholder('Título').first()).toHaveValue(titulo)
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()
    await expect(card.getByText(titulo)).toBeVisible()
}

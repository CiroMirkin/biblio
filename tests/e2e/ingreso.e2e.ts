import { test, expect, abrirSocio, cardPrestamos } from './app'

// sin gestión de cuotas los socios de las fixtures no se dan de baja solos por cuotas adeudadas
test.use({ ajustes: { gestionDeCuotas: false, catalogacionSimple: true } })

test('un libro ingresado en modo simple queda en el inventario después de reabrir la app', async ({ page, reabrirApp }) => {
    await page.getByRole('button', { name: 'Ingreso de libros' }).click()
    await page.locator('#numeroInventario').fill('600')
    await page.locator('#titulo').fill('Rayuela')
    await page.locator('#autor').fill('Cortazar, Julio')
    await page.getByRole('button', { name: 'Ingresar Libro' }).click()
    await expect(page.getByText('Libro ingresado exitosamente')).toBeVisible()

    page = await reabrirApp()

    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill('600')
    await card.getByPlaceholder('N°').first().press('Enter')
    await expect(card.getByPlaceholder('Título').first()).toHaveValue('Rayuela')
    await expect(card.getByPlaceholder('Título').first()).toBeDisabled()
})

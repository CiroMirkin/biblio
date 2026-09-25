import { test, expect, inscribir, abrirSocio, volverALista, MESES } from './app'

test('marcar el mes actual como pago persiste y se puede revertir', async ({ page }) => {
    await inscribir(page, 'Zeta', 'Ana')
    await abrirSocio(page, 'Zeta')

    const mes = () => page.locator('li', { hasText: MESES[new Date().getMonth()] })
    await expect(mes().getByRole('button', { name: 'Adeuda' })).toBeVisible()
    await mes().click()
    await expect(mes().getByRole('button', { name: 'Pago' })).toBeVisible()

    await volverALista(page)
    await abrirSocio(page, 'Zeta')
    await expect(mes().getByRole('button', { name: 'Pago' })).toBeVisible()

    await mes().click()
    await expect(mes().getByRole('button', { name: 'Adeuda' })).toBeVisible()
})

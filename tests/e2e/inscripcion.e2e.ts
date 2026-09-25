import { test, expect, inscribir, abrirSocio } from './app'

test('el socio nuevo aparece en la lista de socios', async ({ page }) => {
    await inscribir(page, 'Zeta', 'Ana')
    await abrirSocio(page, 'Zeta')
    await expect(page.getByRole('heading', { name: 'Zeta, Ana' })).toBeVisible()
})

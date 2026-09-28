import fs from 'node:fs'
import path from 'node:path'
import { test, expect, inscribir, abrirSocio, volverALista, cardPrestamos, restaurarFixtures } from './app'

// sin gestión de cuotas los socios de las fixtures no se dan de baja solos por cuotas adeudadas
test.use({ ajustes: { gestionDeCuotas: false, maximoLibrosEnPrestamo: 2 } })

// fixtures: Kevin no tiene préstamos, así que tiene tantas filas vacías como el máximo de préstamos

test('exportar una copia completa y volver a importarla restaura socios y ajustes', async ({ page, electronApp, reabrirApp }, testInfo) => {
    const copia = testInfo.outputPath('copia_completa.xlsx')

    await inscribir(page, 'Zeta', 'Ana')

    await electronApp().evaluate(({ dialog }, filePath) => {
        dialog.showSaveDialog = async () => ({ canceled: false, filePath })
    }, copia)
    await page.getByRole('button', { name: 'Ajustes' }).click()
    await page.getByRole('button', { name: 'Copia completa', exact: true }).click()
    // el archivo aparece durante la exportación, el botón vuelve a su texto cuando termina
    await expect.poll(() => fs.existsSync(copia)).toBe(true)
    await expect(page.getByRole('button', { name: 'Copia completa', exact: true })).toBeEnabled()

    // perder los datos: archivos originales y ajustes por defecto
    const userData = await electronApp().evaluate(({ app }) => app.getPath('userData'))
    restaurarFixtures()
    fs.writeFileSync(path.join(userData, 'settings.json'), JSON.stringify({ gestionDeCuotas: false }))
    page = await reabrirApp()

    await abrirSocio(page, 'Kevin')
    await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(4)

    await electronApp().evaluate(({ dialog }, filePath) => {
        dialog.showOpenDialog = async () => ({ canceled: false, filePaths: [filePath] })
    }, copia)
    await page.getByRole('button', { name: 'Ajustes' }).click()
    await page.getByRole('button', { name: 'Importar copia completa' }).click()
    await expect(page.getByText('¡Importado exitosamente!')).toBeVisible()

    // la app pide reiniciar después de importar
    page = await reabrirApp()
    await abrirSocio(page, 'Zeta')
    await volverALista(page)
    await abrirSocio(page, 'Kevin')
    await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(2)
})

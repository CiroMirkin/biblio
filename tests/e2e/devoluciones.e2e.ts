import { test, expect, abrirSocio, volverALista, cardPrestamos, filaPrestamo, prestarLibro } from './app'

// sin gestión de cuotas los socios de las fixtures no se dan de baja solos por cuotas adeudadas
test.use({ ajustes: { gestionDeCuotas: false } })

test('el libro devuelto deja de figurar en préstamo y libera una fila', async ({ page }) => {
    await abrirSocio(page, 'Julia')
    const card = cardPrestamos(page)
    await expect(card.getByPlaceholder('N°')).toHaveCount(3)

    await filaPrestamo(page, 'Ficciones').getByRole('button').click()
    await expect(filaPrestamo(page, 'Ficciones')).toHaveCount(0)
    await expect(card.getByPlaceholder('N°')).toHaveCount(4)

    await volverALista(page)
    await abrirSocio(page, 'Julia')
    await expect(filaPrestamo(page, 'Ficciones')).toHaveCount(0)
})

test('el libro devuelto vuelve a estar disponible para otro socio', async ({ page }) => {
    await abrirSocio(page, 'Julia')
    await filaPrestamo(page, 'Ficciones').getByRole('button').click()
    await expect(filaPrestamo(page, 'Ficciones')).toHaveCount(0)

    await volverALista(page)
    await abrirSocio(page, 'Kevin')
    await prestarLibro(page, '2', 'Ficciones')
})

test('la fila liberada se puede usar para un préstamo nuevo', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    await prestarLibro(page, '1', 'Bar del Infierno')
    await filaPrestamo(page, 'Bar del Infierno').getByRole('button').click()
    await expect(filaPrestamo(page, 'Bar del Infierno')).toHaveCount(0)

    await prestarLibro(page, '1', 'Bar del Infierno')
})

test('un libro prestado con un N° nuevo se autocompleta después de devolverlo', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill('500')
    await card.getByPlaceholder('N°').first().press('Enter')
    await card.getByPlaceholder('Título').first().fill('Cien años de soledad')
    await card.getByPlaceholder('Autor (Apellido, Nombre)').first().fill('Garcia Marquez, Gabriel')
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()
    await filaPrestamo(page, 'Cien años de soledad').getByRole('button').click()
    await expect(filaPrestamo(page, 'Cien años de soledad')).toHaveCount(0)

    // otro socio lo encuentra en el inventario como disponible
    await volverALista(page)
    await abrirSocio(page, 'Laura')
    const cardLaura = cardPrestamos(page)
    await cardLaura.getByPlaceholder('N°').first().fill('500')
    await cardLaura.getByPlaceholder('N°').first().press('Enter')
    await expect(cardLaura.getByPlaceholder('Título').first()).toHaveValue('Cien años de soledad')
    await expect(cardLaura.getByPlaceholder('Autor (Apellido, Nombre)').first()).toHaveValue('Garcia Marquez, Gabriel')
    await expect(cardLaura.getByPlaceholder('Título').first()).toBeDisabled()
    await cardLaura.getByRole('button', { name: 'Registrar préstamo' }).click()
    await expect(filaPrestamo(page, 'Cien años de soledad')).toContainText('500')
})

test('un libro prestado con un N° nuevo queda en el inventario después de reabrir la app', async ({ page, reabrirApp }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill('500')
    await card.getByPlaceholder('N°').first().press('Enter')
    await card.getByPlaceholder('Título').first().fill('Cien años de soledad')
    await card.getByPlaceholder('Autor (Apellido, Nombre)').first().fill('Garcia Marquez, Gabriel')
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()
    await filaPrestamo(page, 'Cien años de soledad').getByRole('button').click()
    await expect(filaPrestamo(page, 'Cien años de soledad')).toHaveCount(0)

    page = await reabrirApp()

    await abrirSocio(page, 'Laura')
    const cardLaura = cardPrestamos(page)
    await cardLaura.getByPlaceholder('N°').first().fill('500')
    await cardLaura.getByPlaceholder('N°').first().press('Enter')
    await expect(cardLaura.getByPlaceholder('Título').first()).toHaveValue('Cien años de soledad')
    await expect(cardLaura.getByPlaceholder('Autor (Apellido, Nombre)').first()).toHaveValue('Garcia Marquez, Gabriel')
    await expect(cardLaura.getByPlaceholder('Título').first()).toBeDisabled()
    await cardLaura.getByRole('button', { name: 'Registrar préstamo' }).click()
    await expect(filaPrestamo(page, 'Cien años de soledad')).toContainText('500')
})

test('devolver un libro sin inventariar lo quita', async ({ page }) => {
    await abrirSocio(page, 'Oscar')
    await filaPrestamo(page, 'Hamlet - macbeth').getByRole('button').click()
    await expect(filaPrestamo(page, 'Hamlet - macbeth')).toHaveCount(0)
    await expect(filaPrestamo(page, 'Aquel dia en el bosque')).toBeVisible()

    await volverALista(page)
    await abrirSocio(page, 'Oscar')
    await expect(filaPrestamo(page, 'Hamlet - macbeth')).toHaveCount(0)
    await expect(filaPrestamo(page, 'Aquel dia en el bosque')).toBeVisible()
})

test('un socio inactivo puede devolver y la fila liberada queda bloqueada', async ({ page }) => {
    await abrirSocio(page, 'Oscar')
    await page.getByRole('button', { name: 'Dar de baja' }).click()

    const card = cardPrestamos(page)
    await filaPrestamo(page, 'Hamlet - macbeth').getByRole('button').click()
    await expect(filaPrestamo(page, 'Hamlet - macbeth')).toHaveCount(0)
    await expect(card.getByPlaceholder('N°')).toBeDisabled()
    await expect(card.getByPlaceholder('Título')).toBeDisabled()
    await expect(card.getByRole('button', { name: 'Registrar préstamo' })).toHaveCount(0)
})

test('un socio inactivo que devuelve su último libro deja de ver el formulario', async ({ page }) => {
    await abrirSocio(page, 'Julia')
    await page.getByRole('button', { name: 'Dar de baja' }).click()

    await filaPrestamo(page, 'Ficciones').getByRole('button').click()
    await expect(filaPrestamo(page, 'Ficciones')).toHaveCount(0)
    await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(0)
})

test('la devolución queda registrada en el historial', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    await prestarLibro(page, '1', 'Bar del Infierno')
    await filaPrestamo(page, 'Bar del Infierno').getByRole('button').click()
    await expect(filaPrestamo(page, 'Bar del Infierno')).toHaveCount(0)

    await page.getByRole('button', { name: 'Consultar historial' }).click()
    const fila = page.getByRole('row', { name: /Bar del Infierno/ })
    await expect(fila).toBeVisible()
    await expect(fila).not.toContainText('Pendiente')
})

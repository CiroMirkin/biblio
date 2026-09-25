import { test, expect, abrirSocio, volverALista, cardPrestamos, filaPrestamo, fechaPrestamo, prestarLibro } from './app'

// sin gestión de cuotas los socios de las fixtures no se dan de baja solos por cuotas adeudadas
test.use({ ajustes: { gestionDeCuotas: false } })

// fixtures: libro 1 "Bar del Infierno" disponible, libro 2 "Ficciones" prestado a Julia (vencido),
// Oscar tiene 2 libros sin inventariar, Kevin no tiene préstamos

test('un socio activo sin préstamos tiene tantas filas vacías como el máximo de préstamos', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await expect(card.getByPlaceholder('N°')).toHaveCount(4)
    await expect(card.getByRole('button', { name: 'Registrar préstamo' })).toBeVisible()
})

test.describe('con máximo de 2 préstamos', () => {
    test.use({ ajustes: { gestionDeCuotas: false, maximoLibrosEnPrestamo: 2 } })

    test('las filas vacías respetan el máximo y descuentan los préstamos existentes', async ({ page }) => {
        await abrirSocio(page, 'Kevin')
        await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(2)

        await volverALista(page)
        await abrirSocio(page, 'Oscar')
        await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(0)
        await expect(filaPrestamo(page, 'Hamlet - macbeth')).toBeVisible()
        await expect(filaPrestamo(page, 'Aquel dia en el bosque')).toBeVisible()
    })
})

test('Enter en el N° de un libro disponible autocompleta título y autor y los bloquea', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill('1')
    await card.getByPlaceholder('N°').first().press('Enter')

    const titulo = card.getByPlaceholder('Título').first()
    const autor = card.getByPlaceholder('Autor (Apellido, Nombre)').first()
    await expect(titulo).toHaveValue('Bar del Infierno')
    await expect(autor).toHaveValue('Alejandro Dolina')
    await expect(titulo).toBeDisabled()
    await expect(autor).toBeDisabled()
    // con fecha automática el foco pasa al N° de la fila siguiente
    await expect(card.getByPlaceholder('N°').nth(1)).toBeFocused()
})

test('enfocar el título con un N° existente también autocompleta', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill('3')
    await card.getByPlaceholder('Título').first().focus()

    await expect(card.getByPlaceholder('Título').first()).toHaveValue('La condesa sangrienta')
    await expect(card.getByPlaceholder('Autor (Apellido, Nombre)').first()).toHaveValue('Alejandra Pizarnik')
})

test('cambiar el N° después de autocompletar limpia y desbloquea título y autor', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    const nro = card.getByPlaceholder('N°').first()
    await nro.fill('1')
    await nro.press('Enter')
    await expect(card.getByPlaceholder('Título').first()).toBeDisabled()

    await nro.fill('10')
    await expect(card.getByPlaceholder('Título').first()).toHaveValue('')
    await expect(card.getByPlaceholder('Título').first()).toBeEnabled()
    await expect(card.getByPlaceholder('Autor (Apellido, Nombre)').first()).toHaveValue('')
})

test('un libro ya prestado a otro socio no se puede prestar', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill('2')
    await card.getByPlaceholder('N°').first().press('Enter')

    await expect(card.getByText('El libro ya está en préstamo, verificá el N° de inventario')).toBeVisible()
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()
    await expect(filaPrestamo(page, 'Ficciones')).toHaveCount(0)

    // corregir el N° quita el aviso
    await card.getByPlaceholder('N°').first().fill('1')
    await expect(card.getByText('El libro ya está en préstamo, verificá el N° de inventario')).toHaveCount(0)
})

test('registrar un préstamo lo muestra con la fecha de hoy y persiste al reabrir el socio', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    await prestarLibro(page, '1', 'Bar del Infierno')

    const fila = filaPrestamo(page, 'Bar del Infierno')
    await expect(fila).toContainText('1')
    await expect(fila).toContainText('Alejandro Dolina')
    await expect(fila.getByTitle(/hace 0 dias/)).toBeVisible()
    await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(3)

    await volverALista(page)
    await abrirSocio(page, 'Kevin')
    await expect(filaPrestamo(page, 'Bar del Infierno')).toBeVisible()
    await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(3)
})

test('el libro prestado queda no disponible para otro socio', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    await prestarLibro(page, '1', 'Bar del Infierno')

    await volverALista(page)
    await abrirSocio(page, 'Laura')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill('1')
    await card.getByPlaceholder('N°').first().press('Enter')
    await expect(card.getByText('El libro ya está en préstamo, verificá el N° de inventario')).toBeVisible()
})

test('un N° inexistente permite cargar título y autor a mano', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').first().fill('500')
    await card.getByPlaceholder('N°').first().press('Enter')

    const titulo = card.getByPlaceholder('Título').first()
    await expect(titulo).toBeFocused()
    await titulo.fill('cien años de soledad')
    await titulo.press('Enter')
    const autor = card.getByPlaceholder('Autor (Apellido, Nombre)').first()
    await expect(autor).toBeFocused()
    await autor.fill('garcia marquez, gabriel')
    await autor.press('Enter')
    // Enter en el autor pasa al N° de la fila siguiente
    await expect(card.getByPlaceholder('N°').nth(1)).toBeFocused()

    await card.getByRole('button', { name: 'Registrar préstamo' }).click()
    const fila = filaPrestamo(page, 'Cien años de soledad')
    await expect(fila).toContainText('500')
    await expect(fila).toContainText('Garcia Marquez, Gabriel')

    // el libro nuevo queda en el inventario: otro socio lo ve como prestado
    await volverALista(page)
    await abrirSocio(page, 'Laura')
    await cardPrestamos(page).getByPlaceholder('N°').first().fill('500')
    await cardPrestamos(page).getByPlaceholder('N°').first().press('Enter')
    await expect(cardPrestamos(page).getByText('El libro ya está en préstamo, verificá el N° de inventario')).toBeVisible()
})

test('se puede prestar un libro solo con título, sin autor y sin N° (se muestra como S/N)', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('Título').first().fill('Libro sin numero')
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()

    const fila = filaPrestamo(page, 'Libro sin numero')
    await expect(fila).toContainText('S/N')
    // columnas: N°, título, autor, fecha
    await expect(fila.locator('span').nth(2)).toHaveText('')
    await expect(card.getByPlaceholder('N°')).toHaveCount(3)

    await volverALista(page)
    await abrirSocio(page, 'Kevin')
    await expect(filaPrestamo(page, 'Libro sin numero')).toContainText('S/N')
})

test('no se puede prestar cargando solo el autor', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('Autor (Apellido, Nombre)').first().fill('Borges, Jorge Luis')
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()

    await expect(card.getByPlaceholder('N°')).toHaveCount(4)
    await expect(card.getByPlaceholder('Autor (Apellido, Nombre)').first()).toHaveValue('Borges, Jorge Luis')

    await volverALista(page)
    await abrirSocio(page, 'Kevin')
    await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(4)
})

test('no se puede prestar un N° sin título y sin autor', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    // N° que no está en el inventario: el Enter no autocompleta y título y autor quedan vacíos
    await card.getByPlaceholder('N°').first().fill('500')
    await card.getByPlaceholder('N°').first().press('Enter')
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()

    await expect(card.getByPlaceholder('N°')).toHaveCount(4)
    await expect(card.getByPlaceholder('N°').first()).toHaveValue('500')

    await volverALista(page)
    await abrirSocio(page, 'Kevin')
    await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(4)

    // el N° tampoco se agregó al inventario: no autocompleta nada
    await cardPrestamos(page).getByPlaceholder('N°').first().fill('500')
    await cardPrestamos(page).getByPlaceholder('N°').first().press('Enter')
    await expect(cardPrestamos(page).getByPlaceholder('Título').first()).toHaveValue('')
    await expect(cardPrestamos(page).getByPlaceholder('Título').first()).toBeEnabled()
})

test('se pueden registrar varios préstamos a la vez', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByPlaceholder('N°').nth(0).fill('1')
    await card.getByPlaceholder('N°').nth(0).press('Enter')
    await card.getByPlaceholder('N°').nth(1).fill('3')
    await card.getByPlaceholder('N°').nth(1).press('Enter')
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()

    await expect(filaPrestamo(page, 'Bar del Infierno')).toBeVisible()
    await expect(filaPrestamo(page, 'La condesa sangrienta')).toBeVisible()
    await expect(card.getByPlaceholder('N°')).toHaveCount(2)

    await volverALista(page)
    await abrirSocio(page, 'Kevin')
    await expect(filaPrestamo(page, 'Bar del Infierno')).toBeVisible()
    await expect(filaPrestamo(page, 'La condesa sangrienta')).toBeVisible()
})

test('registrar sin completar ninguna fila no hace nada', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()

    await expect(card.getByPlaceholder('N°')).toHaveCount(4)
    await volverALista(page)
    await abrirSocio(page, 'Kevin')
    await expect(cardPrestamos(page).getByPlaceholder('N°')).toHaveCount(4)
})

test('al llegar al máximo de préstamos no quedan filas vacías', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    const card = cardPrestamos(page)
    for (const [i, nro] of ['1', '3', '4', '5'].entries()) {
        await card.getByPlaceholder('N°').nth(i).fill(nro)
        await card.getByPlaceholder('N°').nth(i).press('Enter')
    }
    await card.getByRole('button', { name: 'Registrar préstamo' }).click()

    await expect(filaPrestamo(page, 'Los detectives salvajes')).toBeVisible()
    await expect(card.getByPlaceholder('N°')).toHaveCount(0)
})

test('un préstamo vencido se resalta y uno nuevo no', async ({ page }) => {
    await abrirSocio(page, 'Julia')
    await expect(fechaPrestamo(page, 'Ficciones')).toHaveAttribute('data-vencido', 'true')

    await prestarLibro(page, '1', 'Bar del Infierno')
    await expect(fechaPrestamo(page, 'Bar del Infierno')).toHaveAttribute('data-vencido', 'false')
})

test('un préstamo se puede devolver y volver a registrar al mismo socio (la fecha se actualiza)', async ({ page }) => {
    await abrirSocio(page, 'Julia')
    // Ficciones está prestado a Julia desde el 12/5/2026
    const fechaAnterior = await fechaPrestamo(page, 'Ficciones').textContent()

    await filaPrestamo(page, 'Ficciones').getByRole('button').click()
    await expect(filaPrestamo(page, 'Ficciones')).toHaveCount(0)
    await prestarLibro(page, '2', 'Ficciones')

    await expect(fechaPrestamo(page, 'Ficciones')).not.toHaveText(fechaAnterior!)
    await expect(fechaPrestamo(page, 'Ficciones')).toHaveAttribute('title', /hace 0 dias/)

    await volverALista(page)
    await abrirSocio(page, 'Julia')
    await expect(filaPrestamo(page, 'Ficciones')).toHaveCount(1)
    await expect(fechaPrestamo(page, 'Ficciones')).toHaveAttribute('title', /hace 0 dias/)
})

test.describe('con fecha de préstamo manual', () => {
    test.use({ ajustes: { gestionDeCuotas: false, fechaDePrestamoAutomatica: false } })

    test('Enter en el N° lleva a la fecha y el préstamo se registra con la fecha elegida', async ({ page }) => {
        await abrirSocio(page, 'Kevin')
        const card = cardPrestamos(page)
        await card.getByPlaceholder('N°').first().fill('1')
        await card.getByPlaceholder('N°').first().press('Enter')

        const fecha = card.locator('input[type="date"]').first()
        await expect(fecha).toBeFocused()
        await fecha.fill('2026-01-15')
        await card.getByRole('button', { name: 'Registrar préstamo' }).click()

        // fecha vieja: supera el límite de días y se marca como vencido
        await expect(fechaPrestamo(page, 'Bar del Infierno')).toContainText('15')
        await expect(fechaPrestamo(page, 'Bar del Infierno')).toHaveAttribute('data-vencido', 'true')

        await volverALista(page)
        await abrirSocio(page, 'Kevin')
        await expect(fechaPrestamo(page, 'Bar del Infierno')).toContainText('15')
    })
})

test.describe('sin números de inventario externos', () => {
    test.use({ ajustes: { gestionDeCuotas: false, numerosDeInventarioExternos: false } })

    test('no se muestra la columna N° y se presta cargando solo título y autor', async ({ page }) => {
        await abrirSocio(page, 'Kevin')
        const card = cardPrestamos(page)
        await expect(card.getByPlaceholder('N°').first()).toBeHidden()

        await card.getByPlaceholder('Título').first().fill('Rayuela')
        await card.getByPlaceholder('Autor (Apellido, Nombre)').first().fill('Cortazar, Julio')
        await card.getByRole('button', { name: 'Registrar préstamo' }).click()

        await expect(filaPrestamo(page, 'Rayuela')).toContainText('Cortazar, Julio')
        await expect(filaPrestamo(page, 'Rayuela').getByText('S/N')).toBeHidden()
    })
})

test('socio inactivo sin préstamos no muestra el formulario de préstamos', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    await page.getByRole('button', { name: 'Dar de baja' }).click()

    const card = cardPrestamos(page)
    await expect(card.getByPlaceholder('N°')).toHaveCount(0)
    await expect(card.getByRole('button', { name: 'Registrar préstamo' })).toHaveCount(0)
})

test('socio inactivo con préstamos los ve pero no puede registrar nuevos', async ({ page }) => {
    await abrirSocio(page, 'Julia')
    await page.getByRole('button', { name: 'Dar de baja' }).click()

    const card = cardPrestamos(page)
    await expect(filaPrestamo(page, 'Ficciones')).toBeVisible()
    await expect(card.getByPlaceholder('N°')).toHaveCount(0)
    await expect(card.getByRole('button', { name: 'Registrar préstamo' })).toHaveCount(0)
})

test('el préstamo queda en el historial como pendiente', async ({ page }) => {
    await abrirSocio(page, 'Kevin')
    await prestarLibro(page, '1', 'Bar del Infierno')

    await page.getByRole('button', { name: 'Consultar historial' }).click()
    const fila = page.getByRole('row', { name: /Bar del Infierno/ })
    await expect(fila).toContainText('Pendiente')
})

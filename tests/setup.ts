import { vi } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

vi.mock('electron', () => ({
    app: { getPath: () => '/tmp' },
}))

vi.mock('../../electron/constants', () => ({
    CUOTAS_XLSX_PATH: path.join(__dirname, 'fixtures/cuotas-test.xlsx'),
    SOCIOS_XLSX_PATH: path.join(__dirname, 'fixtures/socios-test.xlsx'),
    LIBROS_XLSX_PATH: path.join(__dirname, 'fixtures/libros-test.xlsx'),
    LIBROS_JSON_PATH: path.join(__dirname, 'fixtures/libros-test.json'),
    MESES: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
}))

# SPEC 05 — Historial de préstamos (persistencia Electron)

**Estado:** Implemented · **Dependencias:** Ninguna · **Fecha:** 2026-07-18
**Objetivo:** Persistir en `prestamos_historial.xlsx` el registro de cada préstamo y devolución, integrando con los handlers existentes `addLibroPrestado` y `devolverLibro`, exponiendo funciones de consulta por socio y por libro, eliminación por año, todo en la capa de Electron sin UI.

---

## Scope

**Incluido:**

- Crear las funciones internas de Electron para manejar el historial:
  - `insertarHistorial(fechaPrestamo, nroSocio, nroLibro)` — genera el UUID internamente con `randomUUID()`
  - `actualizarFechaDevolucion(idPrestamo, fechaDevolucion)`
  - `getHistorialSocio(nroSocio)` — devuelve todas las entradas de un socio
  - `getHistorialLibro(nroLibro)` — devuelve todas las entradas de un libro
  - `eliminarHistorialAnio(anio)` — elimina todas las entradas de un año
  - `actualizarNroLibroEnHistorial(viejoNro, nuevoNro)` — actualiza `N° Libro` en todas las filas del historial que coincidan
- Agregar constante `PRESTAMOS_HISTORIAL_XLSX_PATH` y helper `getHistorialWorksheet()` en `electron/constants.ts`
- Agregar `prestamos_historial.xlsx` a `initializeDataFiles.ts`
- Integrar `insertarHistorial` dentro de `addLibroPrestado` (después de prestar el libro)
- Integrar `actualizarFechaDevolucion` dentro de `devolverLibro` (después de devolver el libro, buscando el idPrestamo por nroLibro + fechaDevolucion null)
- Integrar `actualizarNroLibroEnHistorial` dentro de `editarDatosLibro` (cuando cambia `numeroInventario`)
- Exportar `getHistorialSocio`, `getHistorialLibro` y `eliminarHistorialAnio` como handlers IPC (sin UI, solo lógica)
- Crear test de integración `tests/eliminarHistorialAnio.integration.spec.ts`
- El archivo `prestamos_historial.xlsx` ya existe en `templates/` con las columnas: `ID Prestamo`, `Fecha Prestamo`, `Fecha Devolucion`, `N° Socio`, `N° Libro`

**No incluido:**

- Ningún componente de UI (React), hook, ni pantalla
- No se expone `insertarHistorial`, `actualizarFechaDevolucion` ni `actualizarNroLibroEnHistorial` como IPC — solo se llaman internamente
- No se modifica el modelo `LibroEnPrestamo` ni los archivos `libros.xlsx`/`socios.xlsx`
- No se versiona el historial ni se migran datos previos
- No hay límite de tamaño ni purge automático

---

## Data model

**Nuevo archivo:** `electron/models/historial.ts`

Contiene la interfaz `HistorialEntry` y las funciones de lectura/escritura del XLSX:

```typescript
interface HistorialEntry {
  idPrestamo: string       // UUID v4, generado con randomUUID()
  fechaPrestamo: Date
  fechaDevolucion: Date | null
  nroSocio: number
  nroLibro: string
}
```

**Funciones en `electron/models/historial.ts`:**

| Función | Parámetros | Retorno |
|---------|-----------|---------|
| `insertarHistorial` | `(fechaPrestamo, nroSocio, nroLibro)` | `Promise<string>` |
| `actualizarFechaDevolucion` | `(idPrestamo, fechaDevolucion)` | `Promise<boolean>` |
| `getHistorialSocio` | `(nroSocio)` | `Promise<HistorialEntry[]>` |
| `getHistorialLibro` | `(nroLibro)` | `Promise<HistorialEntry[]>` |
| `eliminarHistorialAnio` | `(anio)` | `Promise<number>` |
| `actualizarNroLibroEnHistorial` | `(viejoNro, nuevoNro)` | `Promise<number>` |

**Handlers IPC:** `electron/handlers/historial/` — importan las funciones del modelo.

**Archivo XLSX:** `prestamos_historial.xlsx`, hoja `Hoja1`, columnas: A=`ID Prestamo`, B=`Fecha Prestamo`, C=`Fecha Devolucion`, D=`N° Socio`, E=`N° Libro`.

---

## Implementation plan

1. **Agregar constante + helper** — en `electron/constants.ts` añadir `PRESTAMOS_HISTORIAL_XLSX_PATH` siguiendo el patrón de `LIBROS_XLSX_PATH` y una función `getHistorialWorksheet()` al estilo de `getLibrosWorksheet`

2. **Agregar a `initializeDataFiles.ts`** — copiar `prestamos_historial.xlsx` desde templates si no existe en destino

3. **Crear fixture de test** — copiar `templates/prestamos_historial.xlsx` como `tests/fixtures/prestamos-historial-template.xlsx`

4. **Crear `electron/models/historial.ts`** — interfaz `HistorialEntry` + las 6 funciones de lectura/escritura usando ExcelJS

5. **Crear handlers IPC** — `electron/handlers/historial/index.ts` con `getHistorialSocio`, `getHistorialLibro`, `eliminarHistorialAnio` (importando del modelo)

6. **Registrar handlers** — agregar los 3 IPC handlers en `electron/handlers/ipcHandlers.ts`

7. **Integrar `insertarHistorial`** — dentro de `electron/handlers/prestamos/addLibroPrestado.ts`, tras exportar el préstamo exitoso, llamar a `insertarHistorial` con la fecha, socio y número de inventario

8. **Integrar `actualizarFechaDevolucion`** — dentro de `electron/handlers/prestamos/devolverLibro.ts`, tras limpiar el préstamo, leer el historial para encontrar la entrada con ese `nroLibro` y `fechaDevolucion = null`, obtener su `idPrestamo`, y llamar a `actualizarFechaDevolucion(idPrestamo, fechaActual)`

9. **Integrar `actualizarNroLibroEnHistorial`** — dentro de `electron/handlers/libros/editarDatosLibro.ts`, cuando `numeroInventario` cambia, llamar a la función del modelo

10. **Crear test de integración** — `tests/eliminarHistorialAnio.integration.spec.ts` que inserte filas de distintos años y valide que solo se eliminan las del año especificado

11. **Ejecutar `npm run build`**, `npm run dist` y `npm test` — verificar que compila, empaqueta y las pruebas pasan

---

## Acceptance criteria

- [ ] `electron/constants.ts` exporta `PRESTAMOS_HISTORIAL_XLSX_PATH` y `getHistorialWorksheet()` siguiendo el patrón existente
- [ ] `electron/utils/initializeDataFiles.ts` copia `prestamos_historial.xlsx` al destino si no existe
- [ ] `electron/models/historial.ts` existe con la interfaz `HistorialEntry` y las 6 funciones exportadas
- [ ] `electron/handlers/historial/index.ts` exporta los 3 handlers IPC: `getHistorialSocio`, `getHistorialLibro`, `eliminarHistorialAnio`
- [ ] Los 3 handlers están registrados en `electron/handlers/ipcHandlers.ts`
- [ ] `addLibroPrestado.ts` llama a `insertarHistorial` tras un préstamo exitoso y el UUID se persiste en el XLSX
- [ ] `devolverLibro.ts` llama a `actualizarFechaDevolucion` tras una devolución exitosa y la fecha se persiste en el XLSX
- [ ] `editarDatosLibro.ts` llama a `actualizarNroLibroEnHistorial` cuando cambia `numeroInventario`
- [ ] `tests/eliminarHistorialAnio.integration.spec.ts` existe y valida que solo se eliminan filas del año indicado
- [ ] `npm run build` compila sin errores
- [ ] `npm run dist` compila y empaqueta sin errores
- [ ] `npm test` pasa todas las pruebas incluyendo la nueva

---

## Decisions taken and discarded

| Decisión | Justificación |
|----------|--------------|
| **Sí:** Historial en XLSX separado (`prestamos_historial.xlsx`) | Sigue el patrón del proyecto (libros, socios, cuotas en XLSX); no introduce motor de base de datos nuevo |
| **Sí:** Interfaz y funciones en `electron/models/historial.ts` | Sigue el patrón de `socio.ts` y `libro.ts`; separa la lógica de modelo de los handlers IPC |
| **Sí:** Handlers IPC en `electron/handlers/historial/` | Sigue el patrón de `prestamos/`, `socios/`, `libros/`; cada dominio en su propia carpeta |
| **Sí:** ID generado con `randomUUID()` en lugar de secuencial | No requiere consultar el último ID; evita colisiones; consistente con el uso de `node:crypto` ya presente en el proyecto |
| **Sí:** `Fecha Devolucion` se actualiza sobre la misma fila | Refleja el ciclo de vida real de un préstamo; evita duplicar entradas |
| **Sí:** `insertarHistorial` y `actualizarFechaDevolucion` no se exponen como IPC | Solo se llaman internamente desde los handlers existentes; la UI futura usará los métodos de consulta |
| **No:** Límite de tamaño ni purge automático | El usuario decide cuándo limpiar mediante `eliminarHistorialAnio` |

---

## Identified risks

| Riesgo | Mitigación |
|--------|-----------|
| El XLSX del historial se corrompe si dos handlers escriben simultáneamente | Electron maneja las IPC de forma secuencial en el proceso main; el riesgo es bajo |
| El fixture de test se desincroniza si cambian las columnas del template | Documentar en el spec que al modificar columnas debe actualizarse también el fixture |

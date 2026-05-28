# SPEC 04 — Gestión de libros con JSON en vez de Excel

> **Estado:** Implemented · **Depende de:** Ninguna · **Fecha:** 2026-05-26
> **Objetivo:** Migrar la gestión de libros de Excel (exceljs) a un archivo JSON plano con lowdb, modificando los cuatro handlers de libros y limpiando el código legacy.

---

## Scope

**Incluido:**

- Agregar `lowdb` como dependencia
- Crear `LIBROS_JSON_PATH` en `electron/constants.ts`
- Refactorizar `addLibroPrestado.ts`, `devolverLibro.ts`, `getLibros.ts`, `getLibrosPrestadosSocio.ts` para usar lowdb en vez de exceljs
- Crear `electron/libros-db.ts` con la instancia de lowdb
- Eliminar `rowToLibro` de `electron/utils/excelhelpers.ts`
- Eliminar `LIBROS_XLSX_PATH` de constants si no lo usa otro handler
- Tests de `getLibros` y `addLibroPrestado` con archivo temporal

**No incluye (diferido a futuros specs):**

- Migración de datos desde `libros.xlsx` — se arranca limpio
- Conversión JSON → Excel para el botón de copia (se hará en otro spec con `librosToExcel()`)
- Tests de `devolverLibro` y `getLibrosPrestadosSocio`
- Refactor de otros handlers (socios, cuotas)
- Script de migración o seed data

---

## Data model

No se introducen estructuras nuevas. El archivo `libros.json` contendrá un array de `LibroEnPrestamo` serializado (con `fechaDePrestamo` como ISO string o null).

**Nuevo archivo:** `electron/libros-db.ts`
- Exporta una instancia de lowdb tipada como `LibroEnPrestamo[]`
- Se encarga de crear el archivo si no existe

Las interfaces `Libro` y `LibroEnPrestamo` se mantienen en `electron/libro.ts` sin cambios.

---

## Implementation plan

1. Instalar lowdb: `npm install lowdb`
2. Agregar `LIBROS_JSON_PATH` a `electron/constants.ts`
3. Crear `electron/libros-db.ts` con la instancia de lowdb apuntando a `LIBROS_JSON_PATH`, tipada como `LibroEnPrestamo[]`
4. Refactorizar `electron/handlers/getLibros.ts` — reemplazar exceljs por `db.data`
5. Refactorizar `electron/handlers/getLibrosPrestadosSocio.ts` — filtrar desde `db.data`
6. Refactorizar `electron/handlers/addLibroPrestado.ts` — buscar por `numeroInventario`, si existe actualizar, si no hacer push, luego `db.write()`
7. Refactorizar `electron/handlers/devolverLibro.ts` — buscar por `numeroInventario`, limpiar campos de socio y fecha, `db.write()`
8. Eliminar `rowToLibro` de `electron/utils/excelhelpers.ts`
9. Eliminar `LIBROS_XLSX_PATH` de constants si no lo usa otro handler
10. Crear `tests/getLibros.spec.ts` con archivo temporal
11. Crear `tests/addLibroPrestado.spec.ts` con archivo temporal
12. `npm run build` y `npm test` para verificar

---

## Acceptance criteria

- [ ] `lowdb` está en `package.json`
- [ ] `electron/libros-db.ts` exporta una instancia de lowdb que crea `libros.json` si no existe
- [ ] `getLibros()` retorna todos los libros desde el JSON
- [ ] `getLibrosPrestadosSocio()` filtra correctamente por socio
- [ ] `addLibroPrestado()` agrega un libro nuevo o actualiza uno existente por `numeroInventario`
- [ ] `devolverLibro()` limpia los campos de socio y fecha del libro correspondiente
- [ ] `LIBROS_XLSX_PATH` ya no existe en constants (o no se usa)
- [ ] `rowToLibro` fue eliminado de `excelhelpers.ts`
- [ ] `tests/getLibros.spec.ts` pasa con archivo temporal
- [ ] `tests/addLibroPrestado.spec.ts` pasa con archivo temporal
- [ ] `npm run build` compila sin errores

---

## Decisions taken and discarded

| Decisión | Justificación |
|---|---|
| **Sí:** lowdb para persistencia JSON | API simple, crea el archivo solo, integración directa con Electron |
| **No (diferido):** reemplazo de `copiarExcel("libros")` | Se hará en otro spec con `librosToExcel()` que convierta JSON → XLSX |
| **No:** fs manual con readFile/writeFile | Habría que manejar creación de archivo, parseo y concurrencia manualmente |
| **Sí:** instancia en `electron/libros-db.ts` | Separación clara: interfaces en `libro.ts`, DB en `libros-db.ts` |
| **No:** migración desde `libros.xlsx` | Reduce complejidad del spec; se arranca limpio |
| **Sí:** archivo temporal en tests | Más real que mocks; lowdb no tiene lógica compleja que justifique mockear |
| **No:** tests unitarios con mocks de lowdb | Archivo temporal es igual de rápido y prueba el código real |
| **Sí:** número 04 como identificador del spec | Decisión explícita del usuario |

---

## Identified risks

| Riesgo | Mitigación |
|---|---|
| lowdb guarda el array completo en cada escritura | Para ~100-500 libros es irrelevante. Si escala, se puede optimizar en otro spec |
| Sin migración desde `libros.xlsx`, se pierden préstamos existentes en producción | Se documenta en este spec. El usuario decide si migrar manualmente o arrancar de cero |

---

## What is **not** in this spec

- Migración de datos desde `libros.xlsx`
- Conversión JSON → Excel para el botón de copia (spec futuro)
- Tests de `devolverLibro` y `getLibrosPrestadosSocio`
- Refactor de otros handlers (socios, cuotas)
- Script de migración o seed data

Cada uno de esos, si llega, va en su propio spec.

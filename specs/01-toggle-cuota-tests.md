# Tests para toggleCuota con mocks e integración real

**Estado:** Implemented
**Dependencias:** Ninguna
**Fecha:** 2026-05-26
**Objetivo:** Refactorizar `tests/toggleCuota.spec.ts` para que use mocks de exceljs en tests unitarios + un test de integración con fixture real que verifique escritura en disco.

---

## Scope

**Incluido:**
- Refactorizar `toggleCuota.spec.ts` para usar mocks de exceljs en tests unitarios
- Mockear `Workbook`, `worksheet`, `getCell`, `eachRow`, etc.
- Verificar valores de celdas específicas antes y después de la llamada
- Mantener los 3 casos actuales
- Un test de integración que usa el fixture real y verifica la escritura en disco
- Separar tests en dos archivos: `toggleCuota.unit.spec.ts` y `toggleCuota.integration.spec.ts`

**No incluido:**
- Tests de otros handlers (`createSocio`, `darDeBajaSocio`, etc.)
- Tests del frontend
- Crear nuevos fixtures

---

## Data model

### tests/setup.ts (existente — se mantiene sin cambios)

Actualmente mockea:
- `electron` → `app.getPath` retorna `/tmp`
- `../../electron/constants` → apunta las rutas `CUOTAS_XLSX_PATH`, `SOCIOS_XLSX_PATH`, `LIBROS_XLSX_PATH` a los fixtures en `tests/fixtures/`
- `MESES` → array con los 12 meses

Los tests unitarios con mocks de exceljs ignorarán estas rutas (nunca se lee el disco). El test de integración usará la ruta mockeada de `CUOTAS_XLSX_PATH` apuntando al fixture copiado como archivo temporal.

### tests/mocks/exceljs.ts (nuevo)

Fábricas reutilizables:

- `createMockWorkbook` — crea un Workbook mock con worksheet y métodos de exceljs
- `createMockWorksheet` — crea una worksheet mock con `eachRow`, `getCell`, `addRow`, etc.
- `createMockRow` — fábrica para filas mock
- `mockExcelJS` — export default agrupado para usar con `vi.mock`

Cada test importa estos mocks y configura solo los datos que necesita.

---

## Implementation plan

1. **Crear `tests/mocks/exceljs.ts`** con fábricas reutilizables: `createMockWorkbook`, `createMockWorksheet`, `createMockRow`, y un `mockExcelJS` default exportado
2. **Refactorizar `toggleCuota.spec.ts`** como `toggleCuota.unit.spec.ts` para:
   - Usar los mocks en lugar de archivos reales
   - Verificar celdas específicas antes/después de la llamada
   - Mantener los 3 casos: cambio de estado, socio inexistente, mes inexistente
3. **Crear `toggleCuota.integration.spec.ts`** que:
   - Usa el fixture real (`cuotas-template.xlsx`) copiado a archivo temporal
   - Ejecuta `toggleCuota` y lee el archivo resultante con ExcelJS real
   - Verifica que la celda modificada tiene el valor esperado en disco
4. **Ejecutar `npm test`** y verificar que todos pasan

---

## Acceptance criteria

- [ ] Los mocks de exceljs están en `tests/mocks/exceljs.ts` y son reutilizables
- [ ] `toggleCuota.unit.spec.ts` usa mocks, no archivos reales
- [ ] Cada test unitario verifica el valor de al menos una celda específica antes y después de llamar a `toggleCuota`
- [ ] `toggleCuota.integration.spec.ts` usa el fixture real y archivo temporal
- [ ] El test de integración verifica que el archivo escrito en disco tiene los valores correctos
- [ ] `npm test` pasa sin errores
- [ ] Los 3 casos (cambio de estado, socio inexistente, mes inexistente) están cubiertos en los unitarios

---

## Decisions taken and discarded

| Decisión | Justificación |
|---|---|
| Mocks en `tests/mocks/exceljs.ts` | Reutilizables entre handlers, evita duplicación |
| Tests híbridos (unit + integración) | Mocks para velocidad y precisión en lógica de celdas; integración para detectar inconsistencias en escritura real |
| Separar en dos archivos `.unit.spec.ts` e `.integration.spec.ts` | Clara separación de responsabilidades; se pueden ejecutar por separado |

---

## Identified risks

- Si el fixture `cuotas-template.xlsx` cambia de estructura, el test de integración puede fallar
- Los mocks deben mantenerse sincronizados con la API real de exceljs si se actualiza la librería

# SPEC 06 — Botón "Sincronizar desde Sheets": agregar libros nuevos desde Google Sheets a `libros.xlsx`

**Estado:** Proposed · **Dependencias:** Ninguna · **Fecha:** 2026-09-13
**Objetivo:** Agregar un botón en `Catalogo.tsx` que, al presionarlo, corra un script de PowerShell que lea un Google Sheet público y agregue al final de `libros.xlsx` (la ruta real que usa la app en runtime) las filas nuevas (N° Inventario + Título + Autor) que todavía no existan, sin duplicar. Reemplaza la idea original de un script standalone con tarea programada (`schtasks`): acá no hay ejecución automática, solo manual vía botón.

---

## Scope

**Incluido:**

- **`ActualizarExcelDesdeSheets.ps1`** (empaquetado como recurso de la app, vía `build.extraResources` en `package.json`, mismo mecanismo que `templates/socios.xlsx`):
  - Recibe como parámetros: `-SheetCsvUrl`, `-ExcelPath`, `-LogPath` (nada hardcodeado adentro del script)
  - Descarga el Sheet como CSV (export público, sin autenticación), forzando `[Net.ServicePointManager]::SecurityProtocol = Tls12` dentro de un `try/catch` (si el `.NET` de la PC es viejo y no soporta el enum, se ignora y sigue)
  - `Import-Csv -Encoding UTF8 -Header Fecha,NroInventario,Autor,Titulo | Select-Object -Skip 1`
  - Normaliza `Fecha` (formato del Sheet: `DD/MM/AAAA`)
  - Lee el N° Inventario ya existente en `-ExcelPath` (vía `Import-Excel`)
  - Inserta en `-ExcelPath` **solo** las filas con N° Inventario y Título presentes, y cuyo N° Inventario no esté ya en el Excel; Autor puede ir vacío; filas incompletas se ignoran sin marcar (se reintentan solas la próxima vez que se presione el botón, si se completa el dato en el Sheet)
  - Inserta el lote nuevo al final, en orden invertido (de abajo hacia arriba)
  - Escribe en `-LogPath` cualquier error (descarga o guardado fallidos): entradas nuevas al principio del archivo, sin límite de tamaño; no reintenta automáticamente
  - Devuelve por `stdout`/código de salida la cantidad de filas insertadas (para que la UI lo muestre) y por `stderr` el detalle de un eventual error
- **Botón en `Catalogo.tsx`**, debajo de `{ !showDetallesLibro && <RecuentoLibros /> }`:
  - Dispara un handler IPC que llama a `child_process.exec` sobre el `.ps1`, pasándole `LIBROS_XLSX_PATH` (la constante real de la app, no la de `templates-dev`), la URL leída de `sheet-url.txt`, y la ruta de `log.txt` (misma carpeta que `libros.xlsx` en producción)
  - Mientras corre: botón deshabilitado / estado de carga
  - Al terminar: toast en la UI con el resultado ("N libros agregados" o el mensaje de error tal cual vino de `stderr`)
- **Chequeo de disponibilidad al arrancar la app** (una sola vez por sesión, en background, resultado cacheado en memoria):
  - PowerShell disponible
  - Módulo `ImportExcel` instalado
  - `sheet-url.txt` existe y no está vacío
  - Si falta cualquiera de los tres, el botón **no se muestra** (no hay mensaje de error, directamente no aparece)
- **`sheet-url.txt`**: archivo de texto plano con la URL del Sheet en una línea, ubicado en la misma carpeta que `libros.xlsx` en producción (`app.getPath('userData')`), agregado manualmente por quien instala/configura la app — no se genera ni se edita desde la UI

**No incluido:**

- Ejecución automática/programada (`schtasks`) — se descarta por completo
- Config file o ajuste en la UI (Ajustes/`electron-store`) para la URL del Sheet — vive en `sheet-url.txt`, no en la app
- Autenticación con Google (el Sheet es público)
- Detección específica de "PowerShell no encontrado" vs "módulo ImportExcel faltante" al hacer clic — solo aplica al chequeo de arranque que oculta el botón; si falla en tiempo de ejecución por otra causa (red, Excel bloqueado), se muestra el `stderr` genérico
- Editar `sheet-url.txt` desde la UI

---

## Data model

**Columnas del Google Sheet (CSV export):** A=Fecha, B=N° Inventario, C=Autor, D=Título (fila 1 se descarta).

**`libros.xlsx` (runtime, `LIBROS_XLSX_PATH`, hoja `Hoja1`):** se lee la columna de N° Inventario existente para dedup, y se hace `Export-Excel -Append` agregando N° Inventario, Título y Autor de las filas nuevas.

**`sheet-url.txt`:** un archivo, una línea, la URL completa de export CSV del Sheet (ej. `https://docs.google.com/spreadsheets/d/1-JQhHJA3eSDuoaQSLPTIFYiJ713wq-fY/export?format=csv&gid=1840277740`).

**`log.txt`:** mismo formato que antes — una línea por error, fecha/hora + detalle, prepend, sin rotación. Vive junto a `libros.xlsx`.

---

## Implementation plan

1. Crear `scripts/ActualizarExcelDesdeSheets.ps1` con parámetros `-SheetCsvUrl`, `-ExcelPath`, `-LogPath` y la lógica descrita arriba
2. Agregar el script a `build.extraResources` en `package.json` (`from: scripts/ActualizarExcelDesdeSheets.ps1`, `to: scripts/ActualizarExcelDesdeSheets.ps1`)
3. Agregar en `electron/constants.ts` la resolución de ruta del script siguiendo el patrón de `RESOURCES_PATH` (`IS_DEV ? process.cwd()/scripts : process.resourcesPath/scripts`), y la ruta de `sheet-url.txt` / `log.txt` junto a `LIBROS_XLSX_PATH`
4. Crear `electron/utils/verificarSincronizacionDisponible.ts` — corre una vez al arrancar (`main.ts`), chequea PowerShell + módulo ImportExcel (`powershell -Command "Get-Module -ListAvailable ImportExcel"`) + existencia/contenido de `sheet-url.txt`, cachea el resultado en memoria, expuesto vía IPC (`sincronizacionDisponible`) para que el renderer lo consulte al montar `Catalogo.tsx`
5. Crear handler IPC `ejecutarSincronizacionDesdeSheets` — arma el comando, corre `child_process.exec`, parsea stdout (cantidad insertada) / stderr (error), devuelve el resultado al renderer
6. En `Catalogo.tsx`: leer disponibilidad vía IPC, renderizar el botón condicionalmente, manejar estado de carga y mostrar el toast con el resultado
7. Probar manualmente: con y sin `sheet-url.txt`, con el módulo ImportExcel desinstalado (botón no debe aparecer), corriendo dos veces seguidas (no debe duplicar), con una fila sin N° o sin Título (debe ignorarse y reaparecer si se completa)
8. `npm run build`, `npm run dist`, `npm test`

---

## Acceptance criteria

- [ ] El botón no aparece en `Catalogo.tsx` si falta PowerShell, el módulo ImportExcel, o `sheet-url.txt`
- [ ] Con las tres condiciones cumplidas, el botón aparece debajo de `RecuentoLibros` y dispara la sincronización al hacer clic
- [ ] Filas con N° Inventario y Título presentes, y N° Inventario no existente en `libros.xlsx`, se insertan al final del archivo real (`LIBROS_XLSX_PATH`), no en `templates-dev`
- [ ] Filas sin N° Inventario o sin Título no se insertan y reaparecen en la corrida siguiente si se completan
- [ ] Correr la sincronización dos veces seguidas sin cambios en el Sheet no duplica ninguna fila
- [ ] Un error (red, Excel bloqueado) se registra en `log.txt` (prepend) y además se muestra en la UI
- [ ] El toast muestra la cantidad de libros agregados en una corrida exitosa
- [ ] `npm run build`, `npm run dist` y `npm test` pasan sin errores

---

## Decisions taken and discarded

| Decisión | Justificación |
|----------|--------------|
| **Sí:** Botón manual en la app en vez de tarea programada (`schtasks`) | El usuario prefirió disparo manual; evita depender de que la PC esté encendida/logueada a un horario fijo |
| **No:** Script standalone con `InstalarTarea.ps1` | Descartado al pasar a disparo por botón — ya no hay horario que configurar |
| **Sí:** El `.ps1` sigue existiendo (no se reimplementa en TypeScript) | El usuario eligió la opción (A): mantener el script externo, la app solo lo invoca vía `child_process` |
| **Sí:** Excel destino es `LIBROS_XLSX_PATH` (runtime real), no `templates-dev\libros.xlsx` | Corrección de un dato incorrecto: `templates-dev` solo es válido en modo desarrollo; en producción el archivo vivo está en `userData` |
| **Sí:** URL del Sheet en `sheet-url.txt` en `userData`, no hardcodeada ni en `electron-store` | El usuario prefirió un archivo editable a mano en la carpeta de datos de usuario, sin agregar UI de Ajustes para algo que se edita rara vez |
| **Sí:** Chequeo de disponibilidad una sola vez al arrancar, cacheado | Spawnear PowerShell es lento (~1-2s); repetirlo cada vez que se entra a Catálogo generaría demora innecesaria |
| **Sí:** Si falta algún requisito, el botón directamente no aparece | Evita mostrar un botón que siempre va a fallar; distinto de un error en tiempo de ejecución (red, Excel bloqueado), que sí se muestra al hacer clic |
| **Sí:** Mantener `log.txt` además del toast en la UI | El usuario pidió conservarlo como registro en disco, aunque ahora también hay feedback inmediato en pantalla |
| **Sí:** Dedup por N° Inventario contra el propio `libros.xlsx`, sin archivo de tracking aparte | Ver spec original — sigue vigente, el Excel es la fuente de verdad |
| **Sí:** `try/catch` alrededor de forzar TLS 1.2 | Windows 7 con .NET viejo puede no tener el enum `Tls12`; evita romper el script si no existe |
| **Sí:** `Import-Csv -Encoding UTF8` | Mitigación preventiva para tildes/ñ, sin costo si el CSV ya venía bien |

---

## Identified risks

| Riesgo | Mitigación |
|--------|-----------|
| `libros.xlsx` abierto por otro proceso de la propia app (ExcelJS) justo cuando corre el `.ps1` | El botón corre bajo demanda con la app abierta; si `Export-Excel` falla por lock, se registra en `log.txt` y se muestra el error, el usuario reintenta al toque |
| PC del usuario no tiene PowerShell 3.0+ o `ImportExcel` instalado | El botón no aparece (Q20/Q21); requiere setup manual una vez por PC, fuera del alcance de este spec |
| `sheet-url.txt` con contenido inválido (no es una URL válida) | El `.ps1` valida que la respuesta no sea HTML (ver incidente 2026-09-22) antes de parsearla como CSV; cualquier otro error de red queda en `log.txt`/toast |
| N° Inventario con espacios/formato distinto entre Sheet y Excel | Hacer `.Trim()` sobre el N° Inventario de ambos lados antes de comparar |
| `child_process.exec` con `ExecutionPolicy` restrictiva en la PC destino | Invocar con `powershell.exe -ExecutionPolicy Bypass -File ...` desde el handler IPC |

---

## Incidentes

### 2026-09-22 — `sheet-url.txt` con URL de edición en vez de exportación CSV

**Síntoma:** al presionar "Sincronizar desde Sheets" se insertaron filas con HTML/JS de la página de Google Sheets al final de `libros.xlsx` (8 filas: 4 vacías + 4 con marcado HTML), en vez de libros nuevos.

**Causa raíz:** `sheet-url.txt` (en `%APPDATA%\biblio\`, no `%APPDATA%\Biblio\` — `app.getPath('userData')` usa el campo `name` del `package.json`, no `productName`) tenía la URL de edición del Sheet (`.../edit?gid=...#gid=...`). `Invoke-WebRequest` devolvió el HTML de la interfaz interactiva de Sheets en vez del CSV; el script lo parseó igual con `ConvertFrom-Csv`, generando filas basura que pasaron el chequeo de dedup (N° Inventario y Título "no vacíos", aunque sin sentido) y se insertaron en el Excel real.

**Corrección aplicada:**
- `sheet-url.txt` de producción corregido a `.../export?format=csv&gid=...`
- `ActualizarExcelDesdeSheets.ps1`: si la respuesta descargada contiene `<html` o `<!DOCTYPE`, el script falla explícitamente con mensaje "La URL configurada en sheet-url.txt es incorrecta: devolvio HTML en vez de CSV" (registrado en `log.txt` y devuelto por `stderr`), en vez de parsearla como CSV
- Se limpiaron las 8 filas basura del `libros.xlsx` de producción (backup tomado antes en `libros.backup-20260922-175828.xlsx`)

**Pendiente / no incluido:** validar en el chequeo de disponibilidad al arrancar (Q26) que la URL en `sheet-url.txt` tenga el formato `/export?format=csv`, para bloquear el botón antes del primer clic en vez de solo fallar en tiempo de ejecución — fuera de alcance de este incidente, evaluar si vale la pena en una futura spec.

# ~~SPEC 02 — Persistencia de ajustes con electron-store~~ (ABANDONADO)

> **Estado:** Abandonado · **Dependencias:** Ninguna · **Fecha:** 2026-05-26
> **Objetivo:** Persistir los ajustes de la aplicación usando `electron-store` con carga automática al inicio y puente IPC entre main y renderer, soportando valores de cualquier tipo serializable.

---

## Scope

**Incluido:**

- Instalar y configurar `electron-store` en el main process
- Crear un bridge IPC con handlers `settings:get`, `settings:set`, `settings:getAll` en el main process
- Exponer los métodos en `preload.ts` para uso desde el renderer
- Persistir automáticamente `limiteDeDias` y `maximoLibrosEnPrestamo` cuando cambian via `setLimiteDeDias` / `setMaximoLibrosEnPrestamo`
- Cargar valores persistedos al llamar `inicializar()` y escribirlos en el store de Zustand
- Infraestructura genérica: cualquier ajuste futuro (número, booleano, objeto, string) puede usar los mismos métodos IPC

**No incluido:**

- UI de ajustes (ya existe, no se modifica)
- Persistencia de datos de socios, libros o cuotas (solo ajustes de configuración)
- Cifrado de los valores persistedos
- Sincronización entre ventanas
- Migraciones versionadas de schema

---

## Data model

### Main process — `electron/settings.ts` (nuevo)

```js
import Store from 'electron-store'

interface SettingsSchema {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
  [key: string]: unknown
}

const store = new Store<SettingsSchema>({
  name: 'settings',
  projectName: 'biblio',
  defaults: {
    limiteDeDias: 40,
    maximoLibrosEnPrestamo: 4,
  },
} as Record<string, unknown>)

export default store
```

### Preload — `preload.ts`

Se exponen tres métodos en `window.electronAPI`:

```
settings.get(key: string): unknown
settings.set(key: string, value: unknown): void
settings.getAll(): Record<string, unknown>
```

### Service — `src/services/settingsService.ts` (nuevo)

```ts
export const settingsService = {
  getAll: (): Promise<Record<string, unknown>> =>
    window.electronAPI.settings.getAll(),
  get: <T>(key: string): Promise<T> =>
    window.electronAPI.settings.get(key) as Promise<T>,
  set: (key: string, value: unknown): Promise<void> =>
    window.electronAPI.settings.set(key, value),
}
```

### Tests — `tests/settingsService.spec.ts` (nuevo)

Mockea `window.electronAPI.settings` y verifica que cada método del service delega correctamente:

- `getAll` → llama a `settings.getAll` y retorna los valores
- `get(key)` → llama a `settings.get` con la key
- `set(key, value)` → llama a `settings.set` con key y valor

### Tests — `tests/settings.spec.ts` (nuevo)

Importa `electron/settings.ts` (con `electron-store` real) y verifica que el store se crea con los defaults correctos.

### Store de Zustand — `store/librosStore.ts`

Sin cambios estructurales. Se agrega lógica de persistencia dentro de `setLimiteDeDias` y `setMaximoLibrosEnPrestamo` (llamar a `settingsService.set(...)`) y en `inicializar` (leer valores persistedos vía `settingsService.getAll()`).

---

## Implementation plan

0. **Verificar prerrequisitos:**
   - `electron-store` compatible con la versión de Electron del proyecto (revisar `electron -v` y docs de `electron-store`)
   - Asegurar que los handlers IPC se registran después de `app.whenReady()` en el main process

1. **Instalar `electron-store`** con `npm install electron-store` y verificar que compila sin errores.

2. **Crear `electron/settings.ts`** con el schema y defaults. Exportar la instancia del store.

3. **Registrar handlers IPC en el main process** (en `electron/main.ts` o donde se definan los ipc handlers):
   - `settings:get(key)` → devuelve `store.get(key)`
   - `settings:set(key, value)` → ejecuta `store.set(key, value)`
   - `settings:getAll` → devuelve `store.store`

4. **Exponer en `preload.ts`** los métodos `settings.get`, `settings.set`, `settings.getAll` via `contextBridge.exposeInMainWorld`.

5. **Crear `src/services/settingsService.ts`** que encapsula `window.electronAPI.settings.*` con métodos tipados.

6. **Actualizar `inicializar()` en `useLibrosStore`** para que cargue `limiteDeDias` y `maximoLibrosEnPrestamo` desde `settingsService.getAll()` antes de aplicar los defaults del store.

7. **Actualizar `setLimiteDeDias` y `setMaximoLibrosEnPrestamo`** para que persistan el nuevo valor via `settingsService.set(...)` después de actualizar el estado local.

8. **Crear `tests/settingsService.spec.ts`** con tests unitarios que mockean `window.electronAPI.settings` y verifican que `settingsService.getAll`, `get` y `set` delegan correctamente.

9. **Crear `tests/settings.spec.ts`** con test de integración que importa `electron/settings.ts` y verifica que el store se crea con los defaults correctos.

10. **Ejecutar `npm test`** y verificar que los tests nuevos pasan.

11. **Ejecutar `npm run dev`** y verificar que los ajustes persisten entre reinicios de la app.

---

## Acceptance criteria

- [ ] `electron-store` instalado y configurado con defaults (`limiteDeDias: 40`, `maximoLibrosEnPrestamo: 4`)
- [ ] Handlers IPC `settings:get`, `settings:set`, `settings:getAll` registrados en el main process
- [ ] Métodos expuestos en `preload.ts` bajo `window.electronAPI.settings.*`
- [ ] `inicializar()` carga valores persistedos y los escribe en el store de Zustand
- [ ] `setLimiteDeDias()` y `setMaximoLibrosEnPrestamo()` persisten el nuevo valor al cambiarlo
- [ ] Cambiar un ajuste, cerrar y reabrir la app: el valor persistedo se mantiene
- [ ] `npm test` pasa incluyendo los 4 tests de `settingsService.spec.ts` y `settings.spec.ts`

---

## Decisions

| Decisión | Justificación |
|---|---|
| **Sí:** `electron-store` en vez de localStorage | localStorage es volátil (se borra al limpiar caché, por sesión privada, etc.). `electron-store` escribe en disco como JSON, los datos sobreviven a cualquier limpieza del navegador |
| **Sí:** `name: 'settings'` + `projectName: 'biblio'` | `electron-store` v11+ requiere `projectName` explícito; `name` define el nombre del archivo (`settings.json`) |
| **Sí:** carga automática en `inicializar()` | Sin fricción para el usuario; los ajustes persisten sin acción manual |
| **Sí:** bridge IPC (main → preload → renderer) | Arquitectura limpia de Electron; el renderer no accede al FS directamente |
| **Decidido:** se abandona este enfoque | La implementación reveló problemas de tipado, ESM y persistencia real que hacen que `electron-store` no sea la herramienta adecuada para este caso de uso. Se reemplazará con una solución más simple basada en `fs` directamente |
| **No:** cifrado de valores | No hay datos sensibles en los ajustes actuales |
| **No:** sincronización entre ventanas | La app tiene una sola ventana por ahora |
| **No:** migraciones versionadas | Riesgo de pérdida de datos no justifica la complejidad actual; se agregan en un spec futuro si hacen falta |

---

## Risks

| Riesgo | Mitigación |
|---|---|
| `electron-store` incompatible con la versión de Node/Electron | Verificar en paso 0 antes de instalar |
| Handlers IPC llamados antes de que `app.whenReady()` se resuelva | Registrados explícitamente después de `whenReady()` (paso 0) |
| `electron-store` ESM puro no compatible con el bundler de `electron-vite` | Requiere external en `vite.config.ts`; aumenta complejidad del build |
| `store.store` no hace merge con defaults | Usar `store.get(key)` en vez de `store.store` para cada clave, pero `getAll` se vuelve tedioso |
| Tipado de `projectName` ausente en la definición TS | Mitigado con cast, pero es señal de que la librería no está diseñada para este uso |

---

## Implementation attempt — problems found

Se implementó completamente el spec pero los tests de persistencia real (cambiar un valor, cerrar y reabrir la app) fallaron. Los problemas detectados:

1. **`store.store` no incluye defaults** — `getAll()` devolvía un objeto vacío si ningún valor había sido seteado explícitamente, porque la propiedad `.store` de `electron-store`/`conf` solo retorna las claves escritas, no el merge con `defaults`.

2. **`projectName` ausente de los tipos TS** — `electron-store` v11 delega en `conf`, cuyos tipos usan `Except<ConfigOptions<T>, 'projectName'>` para omitir `projectName` aunque la opción es requerida en runtime. Obligó a un `as Record<string, unknown>` para compilar.

3. **`inicializar()` nunca se llama en Ajustes** — Solo `Catalogo.tsx` y `Socios.tsx` invocan `inicializar()`. La página de ajustes nunca cargaba los valores persistedos al abrirse por primera vez.

4. **Persistencia real no funciona al reiniciar** — Incluso tras solucionar `projectName` y asegurar que los setters llamaban IPC, los valores volvían a los defaults al cerrar y reabrir la app con `npm run dev`. La causa raíz involucraba la interacción entre la configuración de `vite.config.ts` (external), el bundling de Electron y el módulo ESM de `electron-store`.

5. **Problemas de entorno de desarrollo** — `electron-store` al ser ESM puro generaba conflictos con el bundler de Vite en el pipeline de `electron-vite`, requiriendo `external` en la configuración de Vite y trabajo extra para mantener el tipado.

## Decisión

Se abandona `electron-store` como solución de persistencia. Se reemplazará por un enfoque más simple y predecible que no dependa de librerías externas con problemas de tipado y módulos. La experiencia mostró que para persistir dos valores numéricos (limitados por ser ajustes de configuración) una librería con su propia gestión de archivos JSON, esquema y ESM agrega complejidad innecesaria.

## What is **not** in this spec

- UI de ajustes (ya existe)
- Persistencia de datos de socios, libros o cuotas
- Cifrado de valores
- Sincronización entre ventanas
- Migraciones versionadas de schema

Cada uno de esos, si llega, va en su propio spec.

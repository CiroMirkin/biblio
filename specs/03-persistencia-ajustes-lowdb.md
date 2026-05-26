# SPEC 03 — Persistencia de ajustes con lowdb

> **Estado:** Draft · **Dependencias:** Ninguna · **Fecha:** 2026-05-26
> **Objetivo:** Persistir los ajustes de la aplicación (`limiteDeDias`, `maximoLibrosEnPrestamo`) usando lowdb en el main process con bridge IPC, carga automática en `inicializar()` y escritura al cambiar cada ajuste.

---

## Scope

**Incluido:**

- Instalar lowdb en el proyecto
- Crear archivo JSON de configuración en `app.getPath('userData')`
- Bridge IPC con handlers `settings:get`, `settings:set`, `settings:getAll`
- Exponer en `preload.ts` bajo `window.electronAPI.settings.*`
- `settingsService` en el renderer (get, set, getAll) tipado con `AppSettings`
- `inicializar()` carga valores persistedos al store de Zustand
- `setLimiteDeDias` / `setMaximoLibrosEnPrestamo` persisten al cambiar
- `inicializar()` también se llama desde la página de Ajustes
- Tests unitarios (mock) + test de integración (disco real)

**No incluido:**

- UI de ajustes (ya existe, no se modifica)
- Persistencia de datos de socios, libros o cuotas
- Cifrado de valores
- Sincronización entre ventanas
- Migraciones versionadas

---

## Data model

### Tipos — `electron/settings.ts`

```ts
export interface AppSettings {
  limiteDeDias: number
  maximoLibrosEnPrestamo: number
}

const DEFAULTS: AppSettings = {
  limiteDeDias: 40,
  maximoLibrosEnPrestamo: 4,
}
```

### Main process — `electron/settings.ts`

```ts
import { JSONFilePreset } from 'lowdb/node'
import { Low } from 'lowdb'

let db: Promise<Low<AppSettings>> | null = null

export async function getDb(): Promise<Low<AppSettings>> {
  if (!db) {
    const { app } = await import('electron')
    const path = await import('path')
    const filePath = path.join(app.getPath('userData'), 'settings.json')
    db = JSONFilePreset<AppSettings>(filePath, DEFAULTS)
  }
  return db
}
```

### Preload — `preload.ts`

```ts
settings.get(key: string): unknown
settings.set(key: string, value: unknown): void
settings.getAll(): Record<string, unknown>
```

### Service — `src/services/settingsService.ts`

```ts
import type { AppSettings } from '../../../electron/settings'

export const settingsService = {
  getAll: (): Promise<AppSettings> =>
    window.electronAPI.settings.getAll() as Promise<AppSettings>,
  get: <K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> =>
    window.electronAPI.settings.get(key) as Promise<AppSettings[K]>,
  set: <K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> =>
    window.electronAPI.settings.set(key, value),
}
```

---

## Implementation plan

1. **Instalar lowdb** con `npm install lowdb`
2. **Crear `electron/settings.ts`** con `AppSettings`, `DEFAULTS`, `getDb()` y lazy init
3. **Registrar handlers IPC** en main process: `settings:get`, `settings:set`, `settings:getAll`
4. **Exponer en `preload.ts`** via `contextBridge.exposeInMainWorld`
5. **Crear `src/services/settingsService.ts`** con métodos tipados que delegan a `window.electronAPI.settings`
6. **Actualizar `useLibrosStore`**: `inicializar()` carga desde service; `setLimiteDeDias`/`setMaximoLibrosEnPrestamo` persisten
7. **Agregar `inicializar()` en Ajustes** para que cargue valores al abrir la página
8. **Tests unitarios**: mockear `window.electronAPI.settings`, verificar delegación de getAll/get/set
9. **Test de integración**: usar `JSONFilePreset` con archivo temporal, verificar escritura/lectura real
10. **Ejecutar `npm test`** y verificar que pasan
11. **Ejecutar `npm run dev`** y verificar persistencia entre reinicios

---

## Acceptance criteria

- [ ] `lowdb` instalado, `AppSettings` interface definida con `limiteDeDias` y `maximoLibrosEnPrestamo`
- [ ] `getDb()` crea el archivo en `app.getPath('userData')/settings.json` con defaults
- [ ] Handlers IPC `settings:get`, `settings:set`, `settings:getAll` registrados en main process
- [ ] Métodos expuestos en `preload.ts` bajo `window.electronAPI.settings.*`
- [ ] `settingsService` delega correctamente a `window.electronAPI.settings`
- [ ] `inicializar()` carga valores persistedos en el store de Zustand
- [ ] `setLimiteDeDias` y `setMaximoLibrosEnPrestamo` persisten al cambiar
- [ ] Ajustes carga valores al abrirse (llama a `inicializar()`)
- [ ] Cambiar un ajuste, cerrar y reabrir la app: el valor persistedo se mantiene
- [ ] Tests unitarios pasan (mock de electronAPI)
- [ ] Test de integración verifica escritura/lectura real en disco
- [ ] `npm test` pasa

---

## Decisions

| Decisión | Justificación |
|---|---|
| **lowdb** en vez de electron-store | Evita los problemas de tipado, ESM complejo y dependencias pesadas que tuvo el intento anterior |
| **JSONFilePreset** (preset) | API minimalista: `await JSONFilePreset(path, defaults)` → `db.data` + `db.write()`. Sin configuración adicional |
| **Lazy init** con `getDb()` | El archivo settings se crea al primer uso, no al arrancar. La ruta (`app.getPath('userData')`) se resuelve dinámicamente cuando se necesita |
| **Mismo patrón IPC** | Main escribe en disco, preload expone, renderer consume via service. Arquitectura probada del proyecto |
| **`inicializar()` en Ajustes** | Fix del bug anterior: la página de ajustes también necesita cargar los valores persistedos |
| **No:** cifrado de valores | No hay datos sensibles en los ajustes actuales |
| **No:** sincronización entre ventanas | La app tiene una sola ventana por ahora |
| **No:** migraciones versionadas | Riesgo de pérdida de datos no justifica la complejidad actual |

---

## Risks

| Riesgo | Mitigación |
|---|---|
| lowdb es ESM puro — posible conflicto con bundler de electron-vite | lowdb tiene 1 sola dependencia y solo usa `fs/promises` en node adapter; si falla se reemplaza por `fs` directo |
| Escritura concurrente si dos handlers llaman `db.write()` a la vez | Las operaciones son secuenciales por ser single-threaded; para dos valores chicos no hay riesgo real |

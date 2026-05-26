# SPEC 02 — Persistencia de ajustes con electron-store

> **Estado:** Draft · **Dependencias:** Ninguna · **Fecha:** 2026-05-26
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
  defaults: {
    limiteDeDias: 40,
    maximoLibrosEnPrestamo: 4,
  },
})

export default store
```

### Preload — `preload.ts`

Se exponen tres métodos en `window.electronAPI`:

```
settings.get(key: string): unknown
settings.set(key: string, value: unknown): void
settings.getAll(): Record<string, unknown>
```

### Store de Zustand — `store/librosStore.ts`

Sin cambios estructurales. Se agrega lógica de persistencia dentro de `setLimiteDeDias` y `setMaximoLibrosEnPrestamo` (llamar a `window.electronAPI.settings.set(...)`) y en `inicializar` (leer valores persistedos antes de aplicar defaults).

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

5. **Actualizar `inicializar()` en `useLibrosStore`** para que cargue `limiteDeDias` y `maximoLibrosEnPrestamo` desde `window.electronAPI.settings.getAll()` antes de aplicar los defaults del store.

6. **Actualizar `setLimiteDeDias` y `setMaximoLibrosEnPrestamo`** para que persistan el nuevo valor via `window.electronAPI.settings.set(...)` después de actualizar el estado local.

7. **Ejecutar `npm run dev`** y verificar que los ajustes persisten entre reinicios de la app.

---

## Acceptance criteria

- [ ] `electron-store` instalado y configurado con defaults (`limiteDeDias: 40`, `maximoLibrosEnPrestamo: 4`)
- [ ] Handlers IPC `settings:get`, `settings:set`, `settings:getAll` registrados en el main process
- [ ] Métodos expuestos en `preload.ts` bajo `window.electronAPI.settings.*`
- [ ] `inicializar()` carga valores persistedos y los escribe en el store de Zustand
- [ ] `setLimiteDeDias()` y `setMaximoLibrosEnPrestamo()` persisten el nuevo valor al cambiarlo
- [ ] Cambiar un ajuste, cerrar y reabrir la app: el valor persistedo se mantiene

---

## Decisions

| Decisión | Justificación |
|---|---|
| **Sí:** `electron-store` en vez de localStorage | localStorage es volátil (se borra al limpiar caché, por sesión privada, etc.). `electron-store` escribe en disco como JSON, los datos sobreviven a cualquier limpieza del navegador |
| **Sí:** carga automática en `inicializar()` | Sin fricción para el usuario; los ajustes persisten sin acción manual |
| **Sí:** bridge IPC (main → preload → renderer) | Arquitectura limpia de Electron; el renderer no accede al FS directamente |
| **No:** cifrado de valores | No hay datos sensibles en los ajustes actuales |
| **No:** sincronización entre ventanas | La app tiene una sola ventana por ahora |
| **No:** migraciones versionadas | Riesgo de pérdida de datos no justifica la complejidad actual; se agregan en un spec futuro si hacen falta |

---

## Risks

| Riesgo | Mitigación |
|---|---|
| `electron-store` incompatible con la versión de Node/Electron | Verificar en paso 0 antes de instalar |
| Handlers IPC llamados antes de que `app.whenReady()` se resuelva | Registrados explícitamente después de `whenReady()` (paso 0) |

---

## What is **not** in this spec

- UI de ajustes (ya existe)
- Persistencia de datos de socios, libros o cuotas
- Cifrado de valores
- Sincronización entre ventanas
- Migraciones versionadas de schema

Cada uno de esos, si llega, va en su propio spec.

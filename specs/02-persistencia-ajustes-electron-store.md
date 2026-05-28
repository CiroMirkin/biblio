# SPEC 02 — Persistencia de ajustes con electron-store (fix)

> **Estado:** Implemented · **Dependencias:** Ninguna · **Fecha:** 2026-05-28
> **Objetivo:** Hacer funcionar la persistencia de ajustes con `electron-store` aplicando los 4 fixes identificados (verificar Electron ≥ 30, external ESM en vite.config, reemplazar `store.store` por `store.get` con claves explícitas, llamar `inicializar()` en `Ajustes.tsx`).

---

## Scope

**Incluido:**

- Verificar que la versión de Electron sea ≥ 30 (prerrequisito de `electron-store`)
- Agregar `electron-store` a `external` en la configuración de `electron-vite` (main process)
- Mover `electron-store` a `dependencies` en `package.json` (no devDependencies)
- Reemplazar `store.store` en el handler `settings:getAll` por objeto con claves explícitas (`{ limiteDeDias: store.get('limiteDeDias'), maximoLibrosEnPrestamo: store.get('maximoLibrosEnPrestamo') }`)
- Usar `store.get(key)` en `settings:get` — los defaults del constructor garantizan el valor aunque la clave nunca se haya escrito
- Simplificar `inicializar()` para que lea valores directamente de `settingsService.getAll()` sin lógica de decisión con `has()`
- Llamar `inicializar()` en `Ajustes.tsx` via `useEffect`
- Configurar `vitest.config.ts` con `deps.inline: ['electron-store']` y `external: ['electron']`
- Actualizar `tests/settings.spec.ts` para mockear `electron-store` en vez de instanciarlo real
- Crear `tests/ipcHandlers.spec.ts` con tests de los 3 handlers incluyendo el caso `limiteDeDias: 0`
- Documentar `store.reset(...keys)` y `store.onDidChange(key, callback)` como métodos disponibles (no se implementan)
- Marcar el contenido anterior de SPEC 02 como obsoleto

**No incluido:**

- Botón "Restaurar defaults" en la UI (no se modifica la pantalla de ajustes)
- `onDidChange` como mecanismo de suscripción en el servicio, ni sincronización entre ventanas (ambos están relacionados: el primero habilita al segundo, y ninguno se implementa en este spec)
- Cifrado de valores persistedos
- Migraciones versionadas de schema

---

## Data model

Este spec no introduce cambios estructurales en el modelo de datos de la versión anterior. Las interfaces de preload y el service `settingsService.ts` se mantienen idénticos.

**Constructor de `electron/settings.ts` — corregido:**

```ts
const store = new Store<SettingsSchema>({
  name: 'settings',
  schema: {
    limiteDeDias: { type: 'number', minimum: 1, maximum: 365 },
    maximoLibrosEnPrestamo: { type: 'number', minimum: 1, maximum: 20 },
  },
  defaults: {
    limiteDeDias: 40,
    maximoLibrosEnPrestamo: 4,
  },
})
```

`projectName` se elimina (no necesario en versiones actuales), y con él desaparece el cast `as Record<string, unknown>` que el spec original requería.

**Cambios de implementación (no afectan la estructura de datos):**

- `handler 'settings:getAll'` → construye objeto con claves explícitas `{ limiteDeDias: store.get('limiteDeDias'), maximoLibrosEnPrestamo: store.get('maximoLibrosEnPrestamo') }` en vez de `store.store`
- `handler 'settings:get(key)'` → usa `store.get(key)` — los defaults del constructor aplican automáticamente
- `inicializar()` → lee valores directamente de `settingsService.getAll()`; los defaults del constructor garantizan que nunca retorna `undefined`
- `Ajustes.tsx` → agrega `useEffect(() => { inicializar() }, [])`

---

## Implementation plan

1. **Verificar Electron ≥ 30.** Ejecutar `npx electron -v` y confirmar que es ≥ 30. Si no, actualizar antes de continuar.

2. **Mover `electron-store` a `dependencies`** en `package.json` (no devDependencies) para que el empaquetador lo incluya en `npm run dist`.

3. **Configurar external en vite.config.ts.** Agregar `electron-store` a `external` en `rollupOptions` de la configuración del main process de `electron-vite`.

4. **Reemplazar `store.store` en `settings:getAll`.** Cambiar el handler IPC a un objeto con claves explícitas: `{ limiteDeDias: store.get('limiteDeDias'), maximoLibrosEnPrestamo: store.get('maximoLibrosEnPrestamo') }`. No usar `store.defaults` ni `store.store`.

5. **Actualizar `settings:get(key)`.** El handler usa `store.get(key)` sin segundo argumento — los defaults del constructor ya garantizan que `limiteDeDias` y `maximoLibrosEnPrestamo` tengan valor aunque nunca se hayan escrito.

6. **Simplificar `inicializar()` en `useLibrosStore`.** Leer valores directamente de `settingsService.getAll()`. Los defaults del constructor garantizan que nunca retorna `undefined`. Usar `??` (nullish coalescing) en vez de `||` para no ignorar valores falsy válidos como `0`.

7. **Agregar `inicializar()` en `Ajustes.tsx`.** Añadir un `useEffect(() => { inicializar() }, [])` al montar el componente.

8. **Configurar `vitest.config.ts`.** Agregar `deps: { inline: ['electron-store'] }` y `server: { deps: { external: ['electron'] } }`.

9. **Actualizar `tests/settings.spec.ts`.** Mockear `electron-store` completo; verificar que el constructor se llamó con los defaults correctos.

10. **Crear `tests/ipcHandlers.spec.ts`.** Testear los handlers `settings:get`, `settings:set`, `settings:getAll` con mock del store, incluyendo el caso `limiteDeDias: 0`.

11. **Ejecutar `npm test`** y verificar que los tests pasan.

12. **Ejecutar `npm run build`** — compila sin errores.

13. **Ejecutar `npm run dist` en directorio limpio** — empaqueta sin errores (valida que `electron-store` está accesible en producción).

14. **Ejecutar `npm run dev`, cambiar un ajuste, cerrar y reabrir: el valor debe persistir.**

---

## Acceptance criteria

- [ ] `electron-store` está en `dependencies` de `package.json` (no devDependencies)
- [ ] `electron-store` está listado en `external` de `rollupOptions` del main process en `vite.config.ts`
- [ ] `vitest.config.ts` tiene `deps.inline: ['electron-store']` y `server.deps.external: ['electron']`
- [ ] `settings:getAll` construye el objeto con claves explícitas (`limiteDeDias`, `maximoLibrosEnPrestamo`), no con `store.store` ni `store.defaults`
- [ ] `inicializar()` lee valores directamente de `settingsService.getAll()` sin lógica de decisión
- [ ] `Ajustes.tsx` llama `inicializar()` al montar el componente
- [ ] `tests/settings.spec.ts` mockea `electron-store` y verifica que el constructor recibe los defaults correctos
- [ ] `tests/ipcHandlers.spec.ts` cubre los 3 handlers incluyendo `limiteDeDias: 0`
- [ ] `npm test` pasa sin errores
- [ ] `npm run build` compila sin errores
- [ ] `npm run dist` empaqueta sin errores en un directorio limpio
- [ ] Cambiar un ajuste, cerrar y reabrir la app: el valor persistedo se mantiene

---

## Decisiones de implementación (post-aprobación)

| Decisión | Justificación |
|---|---|
| `registerSettingsHandlers()` en `electron/utils/` en vez de `electron/handlers/` | No es un handler en sí, sino una función que registra handlers en `ipcMain`. Separarlo evita mezclar responsabilidades y simplifica los tests. |

## Decisions

| Decisión | Justificación |
|---|---|
| **Sí:** Reabrir SPEC 02 y marcar su contenido anterior como obsoleto | El spec original documentó problemas que ahora tienen solución conocida; reescribir sobre el mismo archivo mantiene el número secuencial y evita confusión |
| **Sí:** `defaults` en el constructor + `store.get(key)` por clave explícita en `getAll` | `defaults` del constructor persiste globalmente: cualquier `store.get('limiteDeDias')` sin segundo argumento ya devuelve `40`. `store.get(key, defaultValue)` es un fallback inline por llamada, no un reemplazo de `defaults`. La combinación de ambos elimina la dependencia de `store.store` y `store.defaults` |
| **Sí:** `getAll()` con claves explícitas en vez de `store.store` o `store.defaults` | `store.defaults` no es propiedad pública documentada; `store.store` solo retorna claves escritas; construir el objeto explícitamente evita ambos problemas y no filtra claves internas de `conf` |
| **Sí:** Schema JSON en el constructor de `electron-store` | Valida tipos, mínimos y máximos automáticamente sin lógica extra en el handler `settings:set` |
| **Sí:** External de `electron-store` en vite.config + `dependencies` | Necesario porque `electron-store` es ESM puro; en `dependencies` para que `electron-builder` lo incluya en el paquete distribuido |
| **No:** `store.has()` como mecanismo en `inicializar()` | `electron-store` escribe defaults al archivo en el primer arranque, haciendo que `has()` devuelva `true` incluso sin intervención del usuario. La distinción entre "valor persistido por el usuario" y "default del constructor" no es posible con `has()`. Leer directamente con `store.get(key)` basta porque los defaults garantizan que nunca retorna `undefined` |
| **No:** Botón "Restaurar defaults" en UI | `store.reset(...keys)` está disponible pero no se expone en la UI en este spec; puede agregarse después sin cambios de infraestructura |
| **No:** `onDidChange` como suscripción en el servicio | Queda documentado como disponible; implementarlo requeriría manejo de lifecycle (unsuscribe al desmontar) que no justifica el caso de uso actual |
| **No:** Sincronización entre ventanas | Relacionado con `onDidChange`; la app tiene una sola ventana por ahora |

---

## Risks

| Riesgo | Mitigación |
|---|---|
| `external` mal configurado rompe el build de producción | Verificar con `npm run dist` en directorio limpio (no solo `npm run build`). `electron-store` en `dependencies` (no dev) para que el empaquetador lo incluya |
| `getAll()` con claves explícitas no escala si se agregan ajustes | Risk aceptado: el spec solo tiene dos claves. Cuando haya más, se refactoriza a una lista iterable |
| `store.get() \|\| default` en cualquier punto del código ignora `0` guardado por el usuario | Test unitario en `ipcHandlers.spec.ts` cubre el caso `limiteDeDias: 0` para detectar regresiones; usar `??` (nullish coalescing) en vez de `\|\|` como convención |
| Handler `settings:set` no valida entrada | Schema JSON en el constructor (`type`, `minimum`, `maximum`). `electron-store` rechaza valores inválidos automáticamente antes de escribir |

---

## Historical — Implementation attempt (original SPEC 02)

La implementación original de este spec encontró los siguientes problemas, que este fix resuelve:

1. **`store.store` no incluye defaults** — `getAll()` devolvía un objeto vacío si ningún valor había sido seteado explícitamente.
2. **`projectName` ausente de los tipos TS** — Obligó a un `as Record<string, unknown>` para compilar. Solución: eliminar `projectName` del constructor (no es necesario en las versiones actuales) y remover el cast, dejando solo `name: 'settings'` + `defaults`.
3. **`inicializar()` nunca se llama en Ajustes** — Solo `Catalogo.tsx` y `Socios.tsx` invocaban `inicializar()`.
4. **Persistencia real no funciona al reiniciar** — Causa raíz: interacción entre vite.config (external), bundling de Electron y módulo ESM de `electron-store`.
5. **Problemas de entorno de desarrollo** — `electron-store` ESM puro generaba conflictos con el bundler de Vite.

**Decisión tomada entonces:** Se abandonó `electron-store`. Este fix la revierte aplicando el conocimiento de la API adquirido posteriormente.

---

## What is **not** in this spec

- Botón "Restaurar defaults" en la UI (otro spec si llega)
- `onDidChange` como suscripción en el servicio (otro spec si llega)
- Sincronización entre ventanas (otro spec si llega)
- Cifrado de valores persistedos
- Migraciones versionadas de schema

Cada uno de esos, si llega, va en su propio spec.

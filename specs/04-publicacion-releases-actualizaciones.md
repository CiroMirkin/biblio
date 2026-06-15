# SPEC 04 — Publicación de releases y actualizaciones automáticas

**Estado:** Implemented · **Dependencias:** Ninguna · **Fecha:** 2026-06-15
**Objetivo:** Publicar automáticamente la última versión en GitHub y agregar un componente de actualización en la pantalla de Ajustes que permita al usuario descargar e instalar la nueva versión mediante `electron-updater`.

---

## Scope

**Incluido:**

- Agregar `electron-updater` a `package.json` (dependencies)
- Configurar `autoUpdater` en `electron/main.ts` con `autoDownload = false`
- Exponer eventos IPC en `electron/preload.ts`
- Crear hook `src/hooks/useUpdater.ts` con estados: `idle`, `available`, `downloading`, `ready`
- Agregar un componente de actualización básico dentro de la pantalla de Ajustes
- Configurar `package.json` con `build.publish` apuntando a GitHub
- Crear `.github/workflows/release.yml` que en cada tag `v*` ejecute `npm run dist` y publique en GitHub Releases (sin borrar releases anteriores — `electron-updater` usa `latest.yml` que siempre apunta al más reciente)
- Documentar el proceso de publicación: `npm version patch|minor|major`, `git push && git push --tags`

**No incluido:**

- Diseño visual definitivo del componente de actualización (se entrega funcional, sin estilos finales)
- `onDidChange` ni sincronización entre ventanas
- Soporte para macOS o Linux
- Firma digital de instaladores
- Publicación manual sin CI (se documenta como opcional pero no se automatiza)
- Manejo de errores de red avanzado (timeout, reintentos) — se maneja el caso básico

---

## Data model

Este spec no introduce cambios en el modelo de datos persistente. No hay nuevos tipos en schemas de `electron-store`, ni nuevas interfaces en `src/types/electron.d.ts`. Las estructuras nuevas son locales al hook y al preload:

- **`useUpdater`** maneja un estado interno con union type: `'idle' | 'available' | 'downloading' | 'ready'` y un número `progress: 0-100`.
- **Preload** expone `window.updater` con métodos `onAvailable`, `onProgress`, `onDownloaded`, `download`, `install`.

Nada de esto se persiste entre sesiones.

---

## Implementation plan

1. **Instalar `electron-updater`** — `npm install electron-updater`
2. **Configurar `package.json`** — agregar `build.publish` con `provider: "github"`, `owner`, `repo`, `releaseType: "release"`
3. **Configurar `autoUpdater` en `electron/main.ts`** — inicializar con `autoDownload = false`, llamar `setupUpdater(win)` tras crear el BrowserWindow, escuchar eventos `update-available`, `download-progress`, `update-downloaded`
4. **Exponer IPC en `electron/preload.ts`** — `onAvailable`, `onProgress`, `onDownloaded`, `download()`, `install()`
5. **Crear `src/hooks/useUpdater.ts`** — hook con estado `idle | available | downloading | ready` y `progress`, devuelve `{ state, progress, download, install }`
6. **Agregar componente base en Ajustes** — dentro de la pantalla de Ajustes, un componente simple que use el hook y muestre botones según estado (sin diseño final)
7. **Crear `.github/workflows/release.yml`** — workflow que se dispara en tags `v*`, ejecuta `npm ci`, `npm run dist`, publica en GitHub Releases con `GH_TOKEN`
8. **Documentar proceso de publicación** — actualizar README o crear sección con `npm version`, `git push --tags`
9. **Ejecutar `npm run build`** — verificar que compila sin errores
10. **Hacer release de prueba** — crear tag `v0.1.0-test`, pushear, verificar que el workflow publica correctamente

---

## Acceptance criteria

- [ ] `electron-updater` está en `dependencies` de `package.json`
- [ ] `electron/main.ts` inicializa `autoUpdater` con `autoDownload = false` y lo configura después de crear el BrowserWindow
- [ ] `electron/preload.ts` expone los 5 métodos IPC: `onAvailable`, `onProgress`, `onDownloaded`, `download`, `install`
- [ ] `src/hooks/useUpdater.ts` maneja correctamente los 4 estados (`idle`, `available`, `downloading`, `ready`) y devuelve `progress`
- [ ] El componente de actualización se renderiza dentro de la pantalla de Ajustes y reacciona a cada estado del hook
- [ ] `package.json` tiene `build.publish` configurado con `provider: "github"`
- [ ] `.github/workflows/release.yml` existe y se dispara en tags `v*`
- [ ] `npm run build` compila sin errores
- [ ] Al pushear un tag `v*`, el workflow de Actions ejecuta y genera un release en GitHub con el `.exe` y `latest.yml`

---

## Decisions taken and discarded

| Decisión | Justificación |
|---|---|
| **Sí:** `autoDownload = false` | El usuario decide cuándo descargar, no se fuerza en segundo plano |
| **Sí:** Componente base dentro de Ajustes, sin diseño final | El usuario lo diseñará después; se entrega funcional para probar el flujo completo |
| **Sí:** No borrar releases anteriores en el workflow | Ya no es requisito; `electron-updater` usa `latest.yml` que siempre apunta al tag más reciente |
| **Sí:** `electron-updater` en dependencies (no dev) | Necesario en producción para que electron-builder lo incluya |
| **Sí:** Workflow CI con GitHub Actions | Automatiza la publicación sin intervención manual |
| **No:** Publicación manual como flujo principal | Se documenta como opcional pero no es el flujo recomendado |
| **No:** Firma digital de instaladores | No es requisito actual; se agrega en otro spec si hace falta |
| **No:** Soporte macOS o Linux | El proyecto solo apunta a Windows |

---

## Identified risks

| Riesgo | Mitigación |
|---|---|
| `electron-updater` incompatible con Electron 22 (CJS) | Verificar compatibilidad al instalar; si no hay versión CJS, evaluar workaround |
| `GH_TOKEN` no configurado en el repositorio causa fallo del workflow | Documentar en el spec los pasos para crear el token y el secret |
| `latest.yml` no se genera o tiene mala ruta | El target `nsis` de electron-builder lo genera automáticamente; verificar en release de prueba |
| El componente de actualización falla si `window.updater` no está definido (entorno dev) | El hook debe ser tolerante: si `window.updater` es undefined, retorna `idle` sin error |

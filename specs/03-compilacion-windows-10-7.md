# SPEC 03 — Compilación para Windows 10 x64 y Windows 7 x32

**Estado:** Deprecated · **Dependencias:** SPEC 02 (persistencia electron-store) · **Fecha:** 2026-06-10
**Objetivo:** Poder compilar y distribuir Biblio como instalador NSIS para Windows 10 x64 (Electron 41, rama `main`) y Windows 7 x32 (Electron 22, rama `win7-support`), con scripts de automatización.

> **Actualización 2026-06-13:** Se unificaron las ramas. `win7-support` pasó a ser `main`.
> Ya no hay compilación para Windows 10 x64. Ver `README.md` para documentación actualizada.

### Cambios realizados

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Rama principal** | `main` (Electron 41, ESM, x64+ia32) | `main` (Electron 22, CJS, ia32) — era `win7-support` |
| **Segunda rama** | `win7-support` (Electron 22, CJS, ia32) | Eliminada (remote). El contenido local se conserva como referencia |
| **Backup main anterior** | No existía | `win10-main-copy` preserva el antiguo `main` en remote |
| **Compilación activa** | `dist` → x64+ia32 (Electron 41), `dist:win7` → ia32 (Electron 22) | Solo `dist` → ia32 (Electron 22). Los alias `dist:win10`, `dist:win7`, `dist:all` existen pero son redundantes |
| **Documentación** | README con tabla de 4 comandos, secciones separadas para Win10 y Win7, proceso de rebase para sincronizar ramas | README simplificado: un solo comando `dist`, sección única de compilación, sin proceso de sync |

**Operación git realizada:**

1. `git checkout win7-support`
2. `git merge main` — incorporó a `win7-support` los commits que `main` tenía y `win7-support` no: `feat: agrega el ajuste precio cuota` y `feat: muestra el precio de las cuotas`
3. `git checkout main`
4. `git reset --hard win7-support` — `main` pasó a apuntar al mismo commit que `win7-support`
5. `git push origin main --force-with-lease` — actualizó `main` en remote
6. `git push origin win10-main-copy` — preservó el antiguo `main` como `win10-main-copy`
7. `git push origin --delete win7-support` — eliminó la rama `win7-support` del remote
8. Se eliminaron archivos `.js` compilados obsoletos (`npm run clean`) que el pre-push hook detectó como tests fallidos
9. Se actualizó `README.md` y se limpió `package.json` (script `dist:all` ahora apunta a `dist`)

**Razón del cambio:** El proyecto solo se distribuye para Windows 7 (32 bits). Mantener dos ramas paralelas con distintos Electron, build config y sistema de módulos agregaba complejidad innecesaria (sincronización mediante rebase, conflictos en `package.json` y `vite.config.ts`, scripts npm con lógica de cambio de rama). Unificar en una sola rama elimina esa carga sin pérdida de funcionalidad, ya que el instalador ia32 con Electron 22 funciona también en Windows 10 y 11.

---

## Scope

**Incluido:**

- Configurar `package.json` para compilar dual x64 + ia32 en rama `main` (Electron 41, Windows 10)
- Crear rama `win7-support` con Electron 22, compilación solo ia32
- Configurar `vite.config.ts` en rama `win7-support` para output CJS (compatibilidad ESM con Electron 22)
- Scripts npm:
  - `npm run dist:win10` — compila x64 + ia32 con Electron 41
  - `npm run dist:win7` — compila solo ia32 con Electron 22 (cambia versión, configura CJS, instala deps, compila)
  - `npm run dist:all` — ejecuta ambos en secuencia
- Sincronización periódica de `win7-support` con `main` (documentada como proceso, no automatizada en script)

**No incluido:**

- Resolver incompatibilidades de dependencias con Electron 22 (se resuelve fuera del spec durante implementación)
- CI/CD pipeline (GitHub Actions, etc.)
- Soporte para macOS o Linux
- Soporte para Windows 7 x64
- Firma digital de los instaladores
- Publicación en releases de GitHub (solo generación local del instalador)
- Prueba automatizada en Windows 7 (se verifica manualmente)

---

## Data model

Este spec no introduce cambios estructurales en el modelo de datos del proyecto. No hay nuevos tipos, interfaces, schemas, ni persistencia. Solo cambios de configuración (`package.json`, `vite.config.ts`) y scripts npm en `package.json`.

---

## Implementation plan

1. **Actualizar `package.json` en `main`** — configurar `build.win.target` con `arch: ["x64", "ia32"]`
2. **Agregar scripts npm en `main`** — `dist:win10: "npm run dist"`, `dist:all: "npm run dist:win10"` (más adelante se modifica para incluir win7)
3. **Crear rama `win7-support` desde `main`** — `git checkout -b win7-support`
4. **Bajar Electron a `^22.3.27` y electron-builder a `^24.13.3`** en `package.json` de `win7-support`
5. **Restringir build a `arch: ["ia32"]`** en `win7-support/package.json`
6. **Configurar output CJS en `vite.config.ts`** de `win7-support` para `vite-plugin-electron`
7. **Instalar dependencias** (`npm install`) en `win7-support` y verificar que compila (`npm run build`)
8. **Agregar script `dist:win7`** en `win7-support/package.json` y en `main/package.json` un script que cambie a la rama, instale y compile
9. **Actualizar `dist:all`** en `main` para ejecutar `dist:win10` seguido de `dist:win7`
10. **Ejecutar `npm run dist:win10`** y verificar que genera instaladores x64 e ia32 sin errores
11. **Ejecutar `npm run dist:win7`** y verificar que genera instalador ia32 sin errores
12. **Documentar proceso de sincronización** de `win7-support` con `main` (rebase periódico)

---

## Acceptance criteria

- [ ] `npm run dist:win10` genera `release/biblio Setup X.X.X.exe` (x64) y `release/biblio Setup X.X.X ia32.exe` sin errores
- [ ] `npm run dist:win7` genera `release/biblio Setup X.X.X ia32.exe` sin errores
- [ ] El instalador x64 se instala y ejecuta correctamente en Windows 10 x64
- [ ] Rama `win7-support` existe y compila con Electron 22 + output CJS
- [ ] `win7-support/package.json` tiene `electron: "^22.3.27"`, `electron-builder: "^24.13.3"`, y `arch: ["ia32"]`
- [ ] `win7-support/vite.config.ts` tiene output CJS configurado
- [ ] Proceso de sincronización documentado en el spec (rebase periódico de `win7-support` contra `main`)
- [ ] **El instalador ia32 se instala y ejecuta correctamente en una computadora con Windows 7 (verificado personalmente)**

---

## Decisions taken and discarded

| Decisión | Justificación |
|---|---|
| **Sí:** Rama `win7-support` separada de `main` | Electron 22 y 41 no pueden coexistir en el mismo `package.json` sin conflictos. Rama separada permite mantener cada versión con sus dependencias específicas |
| **Sí:** Output CJS en `win7-support` | Electron 22 no soporta ESM en el proceso principal. Es el cambio mínimo para que funcione |
| **Sí:** Scripts npm en lugar de Makefile o task runner externo | El proyecto ya usa npm scripts. No agrega dependencias nuevas |
| **Sí:** `dist:all` ejecuta ambas compilaciones en secuencia | Un solo comando para generar ambos instaladores; el desarrollador elige si ejecuta todo o uno solo |
| **Sí:** Sincronización manual mediante rebase | El spec documenta el proceso pero no lo automatiza; la frecuencia queda a criterio del desarrollador |
| **No:** CI/CD pipeline automatizado | Fuera de scope. Se evalúa en otro spec si hace falta |
| **No:** Firma digital de instaladores | No es requisito para distribución local. Se agrega si se publica oficialmente |
| **No:** Soporte para Windows 7 x64 | Windows 7 x64 es muy poco común; el guide menciona solo x32 |

---

## Sync process (rebase periódico de `win7-support` contra `main`)

1. Asegurarse de tener un working tree limpio en ambas ramas (`git status`).
2. `git checkout win7-support`
3. `git fetch origin main`
4. `git rebase origin/main`
5. Resolver conflictos si los hay (prestar atención a `package.json`, `vite.config.ts`, `package-lock.json`).
6. `git push origin win7-support --force-with-lease` (si el rebase reescribe historia compartida).
7. `npm install` para actualizar dependencias si `package-lock.json` cambió.
8. `npm run build` para verificar que compila correctamente.
9. Si hay cambios en configuraciones de compilación, ejecutar `npm run dist:win7` para verificar que el instalador sigue generándose.

> **Frecuencia:** A criterio del desarrollador. Se recomienda hacerlo al menos una vez por sprint o después de cambios significativos en `main` que afecten dependencias o configuración de compilación.

## Identified risks

| Riesgo | Mitigación |
|---|---|
| Dependencias incompatibles con Electron 22 (ej. `electron-store` ESM puro) | Se resuelve durante implementación fuera del spec; si alguna dependencia no tiene versión compatible, se evalúa reemplazo o workaround |
| Acceso denegado al compilar por instancia de `biblio.exe` abierta | Documentar en el spec que hay que cerrar la app antes de compilar |
| `dist:all` falla en la mitad (win10 ok, win7 fail) | Los scripts son independientes; `dist:win7` se puede ejecutar solo después de corregir el error |
| Rebase de `win7-support` contra `main` introduce conflictos | Resolver con `git rebase` estándar; si hay cambios en `electron/` o `vite.config.ts` que afectan al branch, revisar manualmente |

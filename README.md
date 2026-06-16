# Biblio

**Flujo de trabajo:**
|Comando | Acción|
|----|----|
|`npm run dev` | Dev server con hot-reload (Vite + Electron) |
|`npm run build` | Compila TS + Vite |
|`npm run dist` | Build + empaqueta con electron-builder (Electron 22, ia32) |
|`npm test` | Ejecuta pruebas sobre los handlers de electron|

Ejecutar Git Bash como administrador antes de ejecutar `npm run dist`.

Ejecuta `npm run clean` para eliminar los directorios de compilacion dist-electron, dist-ts y release, junto con todos los archivos .js y .d.ts en los directorios `src`, `electron`, `test` y sus subdirectorios.

La carpeta `templates` en la raíz del proyecto contiene tres archivos: `cuotas.xlsx`, `libros.xlsx` y `socios.xlsx`, los cuales están en blanco. En modo dev debes crear una carpeta `templates-dev` con tus datos de desarrollo.

Si se cambia el nombre del directorio `templates` deben actualizarce `electron\constants.ts` y `electron\utils\initializeDataFiles.ts`.

---

Para agregar nuevas funcion IPC de Electron:

1. Agregar la funcion dentro del directorio `electron\handlers`
2. Agregar la funcion como ipc en `electron\main.ts`
2. Agrega la funcion dentro del preload en `electron\preload.ts`
3. Agrega el tipado de la funcion para React en `src\types\electron.d.ts`

Opcional: puede ser necesario crear o actualizar algun servicio dentro de `src\services`

Para agregar nuevos ajustes al sistema modificar:

1. *SettingsSchema* y el *store* en `electron\settings.ts`
2. *SettingsSchema* en `src\types\electron.d.ts`
3. *Settings* en `src\services\settingsService.ts`
4. Actualiza las pruebas en `tests\settings.spec.ts` y en `tests\ipcHandlers.spec.ts`.
5. Si es necesario actualiza `src\store\useSettingsStore.ts`.

Luego si se usa el componente `Form` en conjunto con el store, el action dentro del store debe devolver el valor luego de ser actualizado, esto permite que `Form` se mantenga actualizado y no sobreescriba los valores.

---

## Compilacion

### Requisitos

- Rama: `main`
- Electron 22, electron-builder 24, `"type": "commonjs"` (CJS)
- Salida CJS en `vite.config.ts` para los procesos main y preload
- `electron-store@7` (CJS)
- Solo ia32

### Compilar

```bash
npm run dist
```

Genera `release/Biblio-Setup.exe` (solo ia32, Electron 22). Compatible con Windows 7 y Windows 10/11.

> **Nota:** Este proyecto se compila exclusivamente para Windows 7 (32 bits). Aunque el instalador funciona en versiones posteriores de Windows, Electron 22 es la última versión con soporte para Windows 7.

---

## Publicación de releases

Para publicar una nueva versión (flujo automático):

1. Actualizar versión:
   ```bash
   npm version patch   # o minor, major
   ```
2. Pushear el commit y el tag:
   ```bash
   git push && git push --tags
   ```
3. El workflow de GitHub Actions se activa automáticamente con el tag `v*`, compila la app y publica el release en GitHub.

Ejemplo de como publicar una nueva versión manualmente:

```bash
npm version 0.1.1-beta --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore: version 0.1.1-beta"
git tag v0.1.1-beta
git push origin main --tags
```

> **Requisito:** El secret `GITHUB_TOKEN` se configura automáticamente en el repositorio. No requiere acción manual.

# Biblio

**Flujo de trabajo:**
|Comando | Acción|
|----|----|
|npm run dev | Dev server con hot-reload (Vite + Electron) |
|npm run build | Compila TS + Vite |
| npm run dist | Build + empaqueta con electron-builder |
|npm test| Ejecuta pruebas sobre los handlers de electron|

Ejecutar Git Bash como administrador antes de ejecutar `npm run dist`.

Ejecuta `npm run clean` para eliminar los directorios de compilacion dist-electron, dist-ts y release, junto con todos los archivos .js y .d.ts en los directorios `src`, `electron`, `test` y sus subdirectorios.

En la raíz del proyecto debe existir una carpeta llamada `templates` con tres archivos: `cuotas.xlsx`, `libros.xlsx` y `socios.xlsx`.

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

Luego si se usa el componente `Form` en conjunto con el store, el action dentro del store debe devolver el valor luego de ser actualizado, esto permite que `Form` se mantenga actualizado y no sobreescriba los valores.

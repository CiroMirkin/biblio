# Biblio

**Flujo de trabajo:**
|Comando | Acción|
|----|----|
|npm run dev | Dev server con hot-reload (Vite + Electron) |
|npm run build | Compila TS + Vite |
| npm run dist | Build + empaqueta con electron-builder (Electron 41, main) |
| npm run dist:win10 | Compila para Windows 10 (x64 + ia32, Electron 41, main) |
| npm run dist:win7 | Compila para Windows 7 (solo ia32, Electron 22, win7-support) |
| npm run dist:all | Ejecuta win10 y win7 en secuencia |
|npm test| Ejecuta pruebas sobre los handlers de electron|

Ejecutar Git Bash como administrador antes de ejecutar `npm run dist`.

Ejecuta `npm run clean` para eliminar los directorios de compilacion dist-electron, dist-ts y release, junto con todos los archivos .js y .d.ts en los directorios `src`, `electron`, `test` y sus subdirectorios.

En la raíz del proyecto debe existir una carpeta llamada `templates` con tres archivos: `cuotas.xlsx`, `libros.xlsx` y `socios.xlsx`. 

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

Luego si se usa el componente `Form` en conjunto con el store, el action dentro del store debe devolver el valor luego de ser actualizado, esto permite que `Form` se mantenga actualizado y no sobreescriba los valores.

---

## Compilacion para Windows 7 (32 bits)

### Requisitos

- Rama: `win7-support`
- Electron 22, electron-builder 24, `"type": "commonjs"` (CJS)
- Salida CJS en `vite.config.ts` para los procesos main y preload
- `electron-store@7` (CJS)

### Compilar

```bash
npm run dist:win7
```

Este comando cambia automaticamente a la rama `win7-support`, instala dependencias, compila y empaqueta. El instalador se genera en `release/biblio Setup X.X.X.exe` (solo ia32, Electron 22).

> **Importante:** el instalador de win7 es el generado por `npm run dist:win7` (no el de `npm run dist:win10`). Ambos comandos producen un archivo con el mismo nombre pero distinto contenido. Verificar que se ejecuta el comando correcto segun el destino.

### Compilacion para Windows 10 (x64 + ia32)

```bash
npm run dist:win10
```

Genera `release/biblio Setup X.X.X.exe` con soporte para x64 e ia32 (Electron 41, rama `main`).

### Compilacion para ambos (secuencial)

```bash
npm run dist:all
```

Ejecuta `dist:win10` seguido de `dist:win7`.

### Mantenimiento (sincronizacion con main)

1. `git checkout win7-support`
2. `git fetch origin main`
3. `git rebase origin/main`
4. Resolver conflictos si los hay (prestar atencion a `package.json`, `vite.config.ts`, `package-lock.json`)
5. `git push origin win7-support --force-with-lease`
6. `npm install` (actualiza dependencias)
7. `npm run build` y `npm run dist:win7` para verificar

La sincronizacion se recomienda al menos una vez por sprint o tras cambios significativos en dependencias o configuracion de compilacion en `main`.

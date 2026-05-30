# Biblio

**Flujo de trabajo:**
|Comando | Acción|
|----|----|
|npm run dev | Dev server con hot-reload (Vite + Electron) |
|npm run build | Compila TS + Vite |
| npm run dist | Build + empaqueta con electron-builder |
|npm test| Ejecuta pruebas sobre los handlers de electron|

Ejecutar Git Bash como administrador antes de ejecutar `npm run dist`.

En la raiz del proyecto debe existir una carpeta llamada `templates` con tres archivos: `cuotas.xlsx`, `libros.xlsx` y `socios.xlsx`.

---

Para agregar nuevos ajustes al sistema modificar:

1. *SettingsSchema* y el *store* en `electron\settings.ts`
2. *SettingsSchema* en `src\types\electron.d.ts`
3. *Settings* en `src\services\settingsService.ts`
4. Actualiza las pruebas en `tests\settings.spec.ts`

Luego si se usa el componente `Form` en conjunto con el store, el action dentro del store debe devolver el valor luego de ser actualizado, esto permite que `Form` se mantenga actualizado y no sobreescriba los valores.

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
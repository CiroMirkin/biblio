import { useUpdater } from "@/hooks/useUpdater"

export function ActualizarApp() {
  const { state, progress, download, install } = useUpdater()

  return (
    <div className="flex flex-col gap-2 card">
      <h3 className="font-semibold text-lg">Actualización de la aplicación</h3>
      {state === 'idle' && (
        <p className="text-sm text-gray-600">No hay actualizaciones disponibles.</p>
      )}
      {state === 'available' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Hay una nueva versión disponible.</p>
          <button className="btn" onClick={download}>Descargar actualización</button>
        </div>
      )}
      {state === 'downloading' && (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-600">Descargando actualización... {progress}%</p>
          <div className="w-full bg-gray-200 rounded h-2">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {state === 'ready' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Actualización descargada. ¿Instalar ahora?</p>
          <button className="btn" onClick={install}>Instalar y reiniciar</button>
        </div>
      )}
    </div>
  )
}

import { Spinner } from "@/components"
import { useUpdater } from "@/hooks/useUpdater"

export function ActualizarApp() {
  const { state, progress, error, download, install } = useUpdater()

  return (
    <div className="flex flex-col gap-2 card">
      <h3 className="font-semibold text-lg">Actualización del sistema</h3>
      {state === 'idle' && (
        <p className="text-sm text-gray-600">No hay actualizaciones disponibles.</p>
      )}
      {state === 'error' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-red-600">Error al buscar actualizaciones: {error}</p>
        </div>
      )}
      {state === 'available' && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600">Hay una nueva versión disponible.</p>
          <button className="max-w-60 btn pt-1 pb-1.5" onClick={download}>Descargar actualización</button>
        </div>
      )}
      {state === 'downloading' && (
        <div className="flex flex-col gap-1">
          <p className="flex items-center gap-2 text-sm text-gray-600">
            <Spinner /> Descargando actualización... {progress}%
          </p>
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
          <div>
            <p className="text-base text-gray-600">Actualización descargada. ¿Instalar ahora?</p>
            <p className="text-sm opacity-70">Nota: Al instalar la actualización no se perderá ningún dato sobre los socios, sus cuotas o sus prestamos.</p>
          </div>
          <button className="max-w-60 btn pt-1 pb-1.5" onClick={install}>Instalar y reiniciar</button>
        </div>
      )}
    </div>
  )
}

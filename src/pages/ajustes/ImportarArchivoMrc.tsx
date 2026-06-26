import { Spinner } from '@/components'
import { cn } from '@/utils'
import { useRef, useState } from 'react'
import { ExcelExportService } from '@/services'
import type { ImportarMrcResult } from '@/types/electron'

type Estado = 'idle' | 'cargando' | 'exito' | 'error'

export function ImportarArchivoMrc() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [estado, setEstado] = useState<Estado>('idle')
  const [resultado, setResultado] = useState<ImportarMrcResult | null>(null)
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null)

  async function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setEstado('cargando')
    setResultado(null)
    setErrorGlobal(null)

    try {
      const res = await ExcelExportService.importarMrc((file as unknown as { path: string }).path)
      setResultado(res)
      setEstado('exito')
    }
    catch (err) {
      setErrorGlobal(err instanceof Error ? err.message : 'Error desconocido')
      setEstado('error')
    }
    finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const cargando = estado === 'cargando'

  return (
    <div className="flex flex-col gap-3 card">
      <h3 className="font-semibold text-lg">Importar archivo ".mrc" desde Koha</h3>

      <div className="flex gap-2">
        <button
          className={cn('btn flex items-center justify-center gap-1.5', cargando && 'btn-disabled')}
          disabled={cargando}
          onClick={() => inputRef.current?.click()}
        >
          { cargando && <Spinner /> }
          <span>{ cargando ? 'Importando...' : 'Seleccionar archivo ".mrc"' }</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".mrc"
        className="hidden"
        onChange={handleArchivo}
      />

       {estado === 'exito' && resultado && (
        <div className="flex flex-col gap-1 text-sm">
          <p className="text-green-600 font-medium">Importación completada</p>
          <ul className="list-disc list-inside text-muted-foreground">
            <li>
              { resultado.agregados } libro{ resultado.agregados !== 1 ? 's' : '' } agregado{ resultado.agregados !== 1 ? 's' : '' }
            </li>
            <li>
              { resultado.actualizados } actualizado{ resultado.actualizados !== 1 ? 's' : '' }
            </li>
            <li>{ resultado.sinCambios } sin cambios</li>
            
            { resultado.errores.length > 0 && (
              <li className="text-yellow-600">{resultado.errores.length} con error</li>
            ) }
          </ul>

          { resultado.errores.length > 0 && (
            <details className="mt-1">
              <summary className="cursor-pointer text-yellow-600 font-medium">
                Ver errores ({ resultado.errores.length })
              </summary>
              <ul className="mt-1 list-disc list-inside text-muted-foreground max-h-40 overflow-y-auto">
                { resultado.errores.map((e, i) => (
                  <li key={i}>
                    Registro {e.index + 1}: {e.reason}
                  </li>
                )) }
              </ul>
            </details>
          ) }
        </div>
      )}

      { estado === 'error' && errorGlobal && (
        <p className="text-red-600 text-sm">{ errorGlobal }</p>
      ) }
    </div>
  )
}
import { CAMPOS_INSCRIPCION, useCamposInscripcionStore } from "@/store"
import { formatTitulo } from "@/utils"

export function AjustarCamposDeInscripcion() {
  const { camposRequeridos, setCampoRequerido } = useCamposInscripcionStore()

  return (
    <section className="card">
        <h2 className="text-lg mb-2">Define que datos son obligatorios y cuales opcionales para inscribir a un socio:</h2>
        <table className="w-md text-base">
            <thead>
                <tr className="text-left flex justify-between">
                    <th className="py-2 px-2">Dato</th>
                    <th className="py-2 px-2">Obligatorio</th>
                </tr>
            </thead>
            <tbody>
                {CAMPOS_INSCRIPCION.map(({ key, label }) => (
                <tr key={key} className=" flex justify-between border-t border-black/10 hover:bg-white-accent">
                    <td className="py-2 px-2">{formatTitulo(label)}</td>
                    <td className="py-2 px-2">
                        <div className="flex gap-4">
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name={`requerido-${key}`}
                                    checked={camposRequeridos[key]}
                                    onChange={() => setCampoRequerido(key, true)}
                                />
                                Si
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name={`requerido-${key}`}
                                    checked={!camposRequeridos[key]}
                                    onChange={() => setCampoRequerido(key, false)}
                                />
                                No
                            </label>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
    </section>
  )
}
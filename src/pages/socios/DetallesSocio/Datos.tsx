import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { useSociosStore } from "@/store"
import { getCaracterSocio } from "@/models"
import { formatName, formatDNI } from "@/utils"
import { PencilIcon } from "@/components/PencilIcon"
import { Spinner } from "@/components"

type CampoEditable = "dni" | "telefono" | "domicilio" | "email" | "fechaNacimiento" | "fechaIngreso" | "fechaEgreso"

export function Datos() {
    const { socioSeleccionado: socio, editarDatos, cambiarNombre } = useSociosStore()
    const [ loading, setLoading ] = useState(false)
    const [expandido, setExpandido] = useState(false)
    const [campoEditando, setCampoEditando] = useState<CampoEditable | null>(null)
    const [valorEdicion, setValorEdicion] = useState("")
    const [editandoNombre, setEditandoNombre] = useState(false)
    const [nombreEdicion, setNombreEdicion] = useState("")

    const caracterSocio = getCaracterSocio(socio?.caracterSocio)

    const iniciarEdicion = (campo: CampoEditable, valorActual: string | undefined) => {
        if(loading) return
        setCampoEditando(campo)
        setValorEdicion(valorActual ?? "")
    }

    const guardar = async () => {
        if (!campoEditando) return
        setLoading(true)
        await editarDatos({ [campoEditando]: valorEdicion })
        setCampoEditando(null)
        setLoading(false)
    }

    const iniciarEdicionNombre = () => {
        if(loading) return
        setNombreEdicion(socio?.nombreYApellido ?? "")
        setEditandoNombre(true)
    }

    const guardarNombre = async () => {
        setLoading(true)
        await cambiarNombre(formatName(nombreEdicion))
        setEditandoNombre(false)
        setLoading(false)
    }

    function CampoEditable({ campo, label, valor }: { campo: CampoEditable; label: string; valor: string | undefined }) {
        const editando = campoEditando === campo
        return (
            <li className="group flex items-center justify-start">
                <span className="font-semibold cursor-default mr-1">{label}</span>
                {editando ? (
                    <>
                        <input
                            autoFocus
                            className="font-normal border-b border-black/40 bg-transparent outline-none px-0.5"
                            value={valorEdicion}
                            onChange={e => setValorEdicion(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && guardar()}
                            disabled={loading}
                        />
                        <button
                            className="ml-2 text-xs font-semibold cursor-pointer hover:underline disabled:opacity-60"
                            onClick={guardar}
                            disabled={loading}
                        >
                            Guardar
                        </button>
                    </>
                ) : (
                    <>
                        <span
                            className="font-normal cursor-pointer hover:font-semibold"
                            onClick={() => iniciarEdicion(campo, valor)}
                        >
                            {valor ?? "-"}
                        </span>
                        <button
                            className="hidden group-hover:inline cursor-pointer"
                            onClick={() => iniciarEdicion(campo, valor)}
                        >
                            <PencilIcon size={20} className="pb-1 ml-px" />
                        </button>
                    </>
                )}
            </li>
        )
    }

    return (
        <div className="card relative">
            <div className="flex justify-between items-center" onClick={() => setExpandido(prev => !prev)}>
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={socio!.nroSocio}
                        className="text-2xl font-semibold"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {socio!.nombreYApellido}
                        {loading && (
                            <span className="ml-1.5">
                                <Spinner /> <span className="text-sm opacity-60">Editando...</span>
                            </span>
                        )}
                    </motion.h2>
                </AnimatePresence>

                { caracterSocio.estado
                    ? <span className="px-2 py-px text-base text-black/95 font-semibold bg-green rounded-sm">Activo</span> 
                    : <span className="px-2 py-px text-base text-black/95 font-semibold bg-amber border rounded-sm">Inactivo</span> 
                }
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={socio!.nroSocio}
                    className="py-1.5"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="font-semibold text-black/70">N° Socio: </span>
                    {socio!.nroSocio}
                </motion.div>
            </AnimatePresence>

            <ul className="list-disc pl-6 text-base">
                <AnimatePresence>
                    {expandido && (
                        <motion.div
                            className="list-disc"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto", paddingBottom: "5px" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: "hidden" }}
                        >
                            <li className="group flex items-center justify-start">
                                <span className="font-semibold cursor-default mr-1">Nombre:</span>
                                {editandoNombre ? (
                                    <>
                                        <input
                                            autoFocus
                                            className="font-normal border-b border-black/40 bg-transparent outline-none px-0.5"
                                            value={nombreEdicion}
                                            onChange={e => setNombreEdicion(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && guardarNombre()}
                                            disabled={loading}
                                            />
                                        <button
                                            className="ml-2 text-xs font-semibold cursor-pointer hover:underline disabled:opacity-60"
                                            onClick={guardarNombre}
                                            disabled={loading}
                                            >
                                            Guardar
                                        </button>
                                        <button
                                            className="ml-4 text-xs opacity-60 cursor-pointer hover:underline"
                                            onClick={() => setEditandoNombre(false)}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span
                                            className="font-normal cursor-pointer hover:font-semibold"
                                            onClick={iniciarEdicionNombre}
                                        >
                                            {socio?.nombreYApellido ?? "-"}
                                        </span>
                                        <button
                                            className="hidden group-hover:inline cursor-pointer"
                                            onClick={iniciarEdicionNombre}
                                        >
                                            <PencilIcon size={20} className="pb-1 ml-px" />
                                        </button>
                                    </>
                                )}
                            </li>

                            <CampoEditable campo="dni" label="DNI:" valor={socio?.dni ? formatDNI(socio.dni) : undefined} />
                            <CampoEditable campo="telefono" label="Número de celular:" valor={socio?.telefono || ''} />
                            <CampoEditable campo="domicilio" label="Dirección:" valor={socio?.domicilio} />
                            <CampoEditable campo="email" label="Email:" valor={socio?.email} />
                            <CampoEditable campo="fechaNacimiento" label="Fecha de nacimiento:" valor={socio?.fechaNacimiento?.toString()} />
                            <CampoEditable campo="fechaIngreso" label="Ingreso:" valor={socio?.fechaIngreso?.toString()} />
                            <CampoEditable campo="fechaEgreso" label="Egreso:" valor={socio?.fechaEgreso?.toString()} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </ul>

            <button
                className="text-sm opacity-60 hover:opacity-100 transition-opacity hover:underline"
                onClick={() => setExpandido(prev => !prev)}
            >
                {expandido ? "Mostrar menos datos" : "Mostrar mas datos"}
            </button>
        </div>
    )
}
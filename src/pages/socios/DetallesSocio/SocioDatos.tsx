import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { useSociosStore } from "@/store"
import { getCaracterSocio } from "@/models"
import { formatDNI } from "@/utils"

export function SocioDatos() {
    const { socioSeleccionado: socio } = useSociosStore()
    const [expandido, setExpandido] = useState(false)

    const caracterSocio = getCaracterSocio(socio?.caracterSocio)
    const fechaNacimiento = socio?.fechaNacimiento

    return (
        <div className="card relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                    {socio?.nombreYApellido}
                </h2>
                { caracterSocio.estado
                    ? <span className="px-2 py-px text-base text-black/95 font-semibold bg-green rounded-sm">Activo</span> 
                    : <span className="px-2 py-px text-base text-black/95 font-semibold bg-amber-300 rounded-sm">Inactivo</span> 
                }
            </div>
            <div className="py-1.5">
                <span className="font-semibold text-black/70">N° Socio: </span>
                {socio?.nroSocio}
            </div>
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
                            <li>
                                <span className="font-semibold">DNI: </span>
                                {socio?.dni && formatDNI(socio.dni)}
                            </li>
                            <li>
                                <span className="font-semibold">Número de celular: </span>
                                {socio?.telefono ?? "-"}
                            </li>
                            <li>
                                <span className="font-semibold">Dirección: </span>
                                {socio?.domicilio}
                            </li>
                            <li>
                                <span className="font-semibold">Email: </span>
                                {socio?.email}
                            </li>
                            <li>
                                <span className="font-semibold">Fecha de nacimiento: </span>
                                {fechaNacimiento && fechaNacimiento}
                            </li>
                            <li>
                                <span className="font-semibold">Ingreso: </span>
                                {socio?.fechaIngreso && socio?.fechaIngreso}
                            </li>
                            <li>
                                <span className="font-semibold">Egreso: </span>
                                {socio?.fechaEgreso && socio?.fechaEgreso}
                            </li>
                        </motion.div>
                    )}
                </AnimatePresence>
            </ul>

            <button
                onClick={() => setExpandido(prev => !prev)}
                className="text-sm opacity-60 hover:opacity-100 transition-opacity hover:underline"
            >
                {expandido ? "Mostrar menos datos" : "Mostrar mas datos  "}
            </button>
        </div>
    )
}
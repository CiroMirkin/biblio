import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { useSociosStore } from "../useSociosStore"

export function SocioDatos() {
    const { socioSeleccionado: socio } = useSociosStore()
    const [expandido, setExpandido] = useState(false)

    return (
        <div className="card relative">
            <div className="flex justify-between">
                <h2 className="text-xl">
                    Datos de <span className="font-semibold">{socio?.nombreYApellido}</span>
                </h2>
                { socio?.caracterSocio.trim() == ""
                    ? <span className="px-2 py-px text-base text-black/95 font-semibold bg-green-300 rounded-sm">Activo</span> 
                    : <span className="px-2 py-px text-base text-black/95 font-semibold bg-amber-300 rounded-sm">Inactivo</span> 
                }
            </div>
            <ul className="list-disc pl-6 text-sm">
                <li>N° Socio: {socio?.nroSocio}</li>
                <li>DNI: {socio?.dni}</li>
                <li>Numero de celular: {socio?.telefono ?? "-"}</li>

                <AnimatePresence>
                    {expandido && (
                        <motion.div
                            className="list-disc"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: "hidden" }}
                        >
                            <li>Dirección: {socio?.domicilio}</li>
                            <li>Fecha de nacimiento: {socio?.fechaNacimiento.toLocaleDateString()}</li>
                            <li>Ingreso: {socio?.fechaIngresoEgreso.toLocaleDateString()}</li>
                            <li>Nacionalidad: {socio?.nacionalidad}</li>
                            <li>Observaciones: {socio?.observaciones}</li>
                        </motion.div>
                    )}
                </AnimatePresence>
            </ul>

            <div className="flex justify-end">
                <button
                    onClick={() => setExpandido(prev => !prev)}
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                    {expandido ? "Mostrar menos datos" : "Mostrar mas datos"}
                </button>
            </div>
        </div>
    )
}
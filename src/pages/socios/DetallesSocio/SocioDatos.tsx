import { useSociosStore } from "../useSociosStore";

export function SocioDatos() {
    const { socioSeleccionado: socio } = useSociosStore()
    
    return (
        <div className="card">
            <h2 className="text-xl">Datos de <span className="font-semibold">{socio?.nombreYApellido}</span></h2>
            <ul className="pt-2 list-disc pl-6 text-sm">
                <li>N° Socio: {socio?.nroSocio}</li>
                <li>DNI: {socio?.dni}</li>
                <li>Numero de celular: {socio?.telefono ?? "-"}</li>
                <li>Dirección: {socio?.domicilio}</li>
                <li>Fecha de nacimiento: {socio?.fechaNacimiento.toLocaleDateString()}</li>
                <li>Nacionalidad: {socio?.nacionalidad}</li>
                <li>Caracter: {socio?.caracterSocio}</li>
                <li>Ingreso: {socio?.fechaIngresoEgreso.toLocaleDateString()}</li>
                <li>Observaciones: {socio?.observaciones}</li>
            </ul>
        </div>
    )
}
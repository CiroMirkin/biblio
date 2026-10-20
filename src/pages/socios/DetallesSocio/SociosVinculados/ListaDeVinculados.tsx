import { useSociosStore, useSocioSeleccionado, useSociosVinculados, useVistaStore } from "@/store"

export function ListaDeVinculados() {
    const { desvincularSocio } = useSociosStore()
    const { verSocio } = useVistaStore()
    const socio = useSocioSeleccionado()
    const sociosVinculados = useSociosVinculados()

    return sociosVinculados.map(vinculado => (
        <button
            key={`${vinculado.nroSocio}-${vinculado.nombreYApellido}`}
            className="btn-secondary hover:underline cursor-pointer"
            onClick={() => verSocio(vinculado.nroSocio)}
            onContextMenu={(e) => {
                e.preventDefault()
                if (socio) desvincularSocio(socio.nroSocio, vinculado.nroSocio)
            }}
        >
            { vinculado.nombreYApellido }
        </button>
    ))
}
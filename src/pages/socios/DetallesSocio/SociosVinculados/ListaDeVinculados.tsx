import { useSociosStore } from "@/store"

export function ListaDeVinculados() {
    const { verSocioVinculado, sociosVinculados, desvincularSocio } = useSociosStore()

    const handleVerSocioVinculado = (nro: number) => {
        verSocioVinculado(nro)
    }

    return sociosVinculados.map(vinculado => (
        <button
            key={`${vinculado.nroSocio}-${vinculado.nombreYApellido}`}
            className="btn-secondary hover:underline cursor-pointer"
            onClick={() => handleVerSocioVinculado(vinculado.nroSocio)}
            onContextMenu={(e) => {
                e.preventDefault()
                desvincularSocio(vinculado.nroSocio)
            }}
        >
            { vinculado.nombreYApellido }
        </button>
    ))
}
import { type LibroRegistrado } from "@/models";

export const buscarLibroPorNro = (dato: string | number, libros: LibroRegistrado[]): LibroRegistrado[] => {
    if (dato !== '' && !isNaN(Number(dato))) {
        return libros.filter(l => (Number(l.numeroInventario) === Number(dato)))
    }
    return []
}

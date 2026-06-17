import { editarDatosSocio } from "./editarDatosSocio";

export const changeObservaciones = async (observaciones: string, nroSocio: number): Promise<boolean> =>
    editarDatosSocio(nroSocio, { observaciones })
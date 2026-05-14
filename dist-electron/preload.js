import { contextBridge, ipcRenderer } from "electron";
//#region electron/preload.ts
contextBridge.exposeInMainWorld("electronAPI", {
	getSocios: () => ipcRenderer.invoke("getSocios"),
	getCuotasSocio: (nroSocio) => ipcRenderer.invoke("getCuotasSocio", nroSocio),
	toggleCuota: (nroSocio, mesIndex) => ipcRenderer.invoke("toggleCuota", nroSocio, mesIndex)
});
//#endregion

import { BrowserWindow, app } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region electron/main.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: { preload: path.join(__dirname, "preload.mjs") }
	});
	if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL);
	else win.loadFile(path.join(__dirname, "../dist/index.html"));
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
//#endregion

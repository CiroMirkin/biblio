import { BrowserWindow, app, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ExcelJS from "exceljs";
//#region electron/main.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
var MESES = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre"
];
var IS_DEV = Boolean(process.env.VITE_DEV_SERVER_URL);
var SOCIOS_XLSX_PATH = IS_DEV ? path.join(process.cwd(), "public", "socios.xlsx") : path.join(app.getPath("userData"), "socios.xlsx");
var CUOTAS_XLSX_PATH = IS_DEV ? path.join(process.cwd(), "public", "cuotas.xlsx") : path.join(app.getPath("userData"), "cuotas.xlsx");
var writeQueue = Promise.resolve();
function enqueueWrite(fn) {
	writeQueue = writeQueue.then(fn).catch(fn);
	return writeQueue;
}
function parseFecha(value) {
	if (value instanceof Date) {
		const d = value;
		return isNaN(d.getTime()) ? null : d.toISOString();
	}
	if (typeof value === "string" && value.trim() !== "") {
		const d = new Date(value);
		return isNaN(d.getTime()) ? null : d.toISOString();
	}
	return null;
}
ipcMain.handle("getSocios", async () => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile(SOCIOS_XLSX_PATH);
	const worksheet = workbook.getWorksheet("datos_prueba_socios");
	if (!worksheet) return [];
	const socios = [];
	worksheet.eachRow((row, rowIndex) => {
		if (rowIndex === 1) return;
		const telefonoRaw = row.getCell(5).value;
		const telefono = telefonoRaw && telefonoRaw !== 0 ? String(telefonoRaw) : null;
		socios.push({
			nroSocio: Number(row.getCell(1).value) || 0,
			nombreYApellido: String(row.getCell(2).value ?? ""),
			domicilio: String(row.getCell(3).value ?? ""),
			dni: Number(row.getCell(4).value) || 0,
			telefono,
			nacionalidad: String(row.getCell(6).value ?? ""),
			fechaNacimiento: parseFecha(row.getCell(7).value),
			caracterSocio: String(row.getCell(8).value ?? ""),
			fechaIngresoEgreso: parseFecha(row.getCell(9).value),
			observaciones: String(row.getCell(10).value ?? "")
		});
	});
	return socios;
});
ipcMain.handle("getCuotasSocio", async (_event, nroSocio) => {
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.readFile(CUOTAS_XLSX_PATH);
	const worksheet = workbook.getWorksheet("cuotas");
	if (!worksheet) return [];
	let meses = [];
	worksheet.eachRow((row, rowIndex) => {
		if (rowIndex === 1) return;
		if (Number(row.getCell(1).value) !== nroSocio) return;
		meses = MESES.map((nombre, i) => {
			const cell = row.getCell(3 + i);
			return { [nombre]: cell.value === "pago" };
		});
	});
	return meses;
});
ipcMain.handle("toggleCuota", async (_event, nroSocio, mesIndex) => {
	return enqueueWrite(async () => {
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.readFile(CUOTAS_XLSX_PATH);
		const worksheet = workbook.getWorksheet("cuotas");
		if (!worksheet) throw new Error("Hoja de cuotas no encontrada");
		let found = false;
		let newStatus = false;
		worksheet.eachRow((row, rowIndex) => {
			if (rowIndex === 1) return;
			if (Number(row.getCell(1).value) !== nroSocio) return;
			found = true;
			const cell = row.getCell(3 + mesIndex);
			if (cell.value === "pago") {
				cell.value = "";
				newStatus = false;
			} else {
				cell.value = "pago";
				newStatus = true;
			}
		});
		if (!found) throw new Error(`Socio ${nroSocio} no encontrado`);
		await workbook.xlsx.writeFile(CUOTAS_XLSX_PATH);
		return newStatus;
	});
});
function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			sandbox: false
		}
	});
	if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL);
	else win.loadFile(path.join(__dirname, "../dist/index.html"));
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
//#endregion

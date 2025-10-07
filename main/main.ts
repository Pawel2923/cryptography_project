import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appServe = app.isPackaged
    ? serve({
        directory: path.join(__dirname, "../renderer")
    })
    : null;

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.ts"),
        },
    })

    if (app.isPackaged && appServe) {
        appServe(window).then(() => {
            window.loadURL("app://-")
        })
    } else {
        window.loadURL("http://localhost:3000");
        window.webContents.openDevTools();
        window.webContents.on("did-fail-load", () => {
            window.webContents.reloadIgnoringCache();
        });
    }
}

function quitApp() {
    if (process.platform !== "darwin") {
        app.quit();
    }
}

app.on("ready", createWindow);
app.on("window-all-closed", quitApp);

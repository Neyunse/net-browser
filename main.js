const { app, BrowserWindow, ipcMain, Menu, globalShortcut } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    minWidth: 1280,
    height: 800,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      sandbox: true,
    },
    titleBarStyle: "hidden", // estilo macOS Safari
  });

  globalShortcut.register("Control+Shift+I", () => { });

  globalShortcut.register("Control+Shift+E", () => {
    win.webContents.openDevTools();
  });

  globalShortcut.register("F12", () => {
    console.log("Atajo F12 bloqueado para DevTools de Electron.");
  });

  win.loadFile(path.join(__dirname, "www/index.html"));
}

app.whenReady().then(() => {
  createWindow();

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("close-browser", () => {
  app.quit();
});

ipcMain.on("maximize-browser", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win.isMaximized()) {
    win.unmaximize()
    return;
  };
  win.maximize();
});

ipcMain.on("minimize-browser", () => {
  const win = BrowserWindow.getFocusedWindow();
  win.minimize();
})


ipcMain.on("open-context-menu", (event, webview) => {
  const menu = Menu.buildFromTemplate([
    {
      label: "DevTools",
      click: () => {
        console.log(webview);

        const current = webview.current;
        current.openDevTools()

      }
    },
    {
      label: "Salir",
      click: () => {
        app.quit();
      }
    }
  ]);
  menu.popup();
});
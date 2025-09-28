const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  CloseBrowser: () => ipcRenderer.send("close-browser"),
  MaximizeBrowser: () => ipcRenderer.send("maximize-browser"),
  MinimizeBrowser: () => ipcRenderer.send("minimize-browser"),

});
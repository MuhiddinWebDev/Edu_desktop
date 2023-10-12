const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
  updateMessage: (callback) => ipcRenderer.on("updateMessage", callback)
});
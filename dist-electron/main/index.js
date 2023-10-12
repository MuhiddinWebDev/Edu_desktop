"use strict";
const electron = require("electron");
const node_os = require("node:os");
const node_path = require("node:path");
const electronUpdater = require("electron-updater");
electronUpdater.autoUpdater.autoDownload = true;
electronUpdater.autoUpdater.setFeedURL({
  provider: "github",
  owner: "IsmailovWD",
  repo: "crm-bitriks-1c-front",
  private: false,
  vPrefixedTagName: true
});
process.env.DIST_ELECTRON = node_path.join(__dirname, "..");
process.env.DIST = node_path.join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? node_path.join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (node_os.release().startsWith("6.1"))
  electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
let win = null;
const preload = node_path.join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = node_path.join(process.env.DIST, "index.html");
async function createWindow() {
  win = new electron.BrowserWindow({
    title: "Main window",
    icon: node_path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    autoHideMenuBar: true
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", new Date().toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      electron.shell.openExternal(url2);
    return { action: "deny" };
  });
  let closeboll = false;
  win.on("close", (e) => {
    if (!closeboll) {
      e.preventDefault();
      const options = {
        type: "question",
        buttons: ["\u0412\u044B\u0445\u043E\u0434", "\u041E\u0442\u043C\u0435\u043D\u0430"],
        defaultId: 0,
        title: "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
        message: "\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0432\u044B\u0439\u0442\u0438 \u0438\u0437 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F?",
        cancelId: 5
      };
      electron.dialog.showMessageBox(win, options).then((response) => {
        console.log(response.response);
        if (response.response === 0) {
          closeboll = true;
          electron.app.quit();
        } else {
          closeboll = false;
        }
      });
    }
  });
}
electron.app.whenReady().then(createWindow);
electron.app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    electron.app.quit();
});
electron.app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
    win.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
electron.ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new electron.BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
electron.app.on("browser-window-focus", () => {
  electron.globalShortcut.register("CommandOrControl+R", () => {
    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  });
});
electron.app.on("browser-window-blur", function() {
  electron.globalShortcut.unregister("CommandOrControl+R");
});
electron.app.commandLine.appendSwitch("ignore-certificate-errors");
electron.app.on("ready", async () => {
  await electronUpdater.autoUpdater.checkForUpdates();
});
electronUpdater.autoUpdater.on("update-downloaded", async (info) => {
  const options = {
    type: "question",
    buttons: ["\u041E\u0431\u043D\u043E\u0432\u043B\u044F\u0442\u044C"],
    title: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u0430",
    message: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0432\u0435\u0440\u0441\u0438\u044F \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D\u0430",
    defaultId: 0,
    cancelId: 0
  };
  electron.dialog.showMessageBox(win, options).then((response) => {
    if (response.response === 0) {
      electronUpdater.autoUpdater.quitAndInstall();
    }
  });
});
electron.app.commandLine.appendSwitch("ignore-certificate-errors", "true");
//# sourceMappingURL=index.js.map

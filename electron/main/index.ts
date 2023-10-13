import { app, BrowserWindow, shell, ipcMain, globalShortcut, dialog, screen } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { autoUpdater } from 'electron-updater'

autoUpdater.autoDownload = true

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'MuhiddinWebDev',
  repo: 'frontend',
  private: false,
  vPrefixedTagName:true
})

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

if (release().startsWith('6.1')) app.disableHardwareAcceleration()

if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    width:width,
    height: height,
    webPreferences: {
      preload,
      nodeIntegration: true, // Disable Node.js integration
      contextIsolation: true, // Enable context isolation
      sandbox: true,
      webSecurity: true,
      devTools:true
    },
    autoHideMenuBar: true
  })

  if (process.env.VITE_DEV_SERVER_URL) { 
    win.loadURL(url)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  let closeboll = false
  win.on('close', (e) => {
    if(!closeboll){
      e.preventDefault();
      const options: Electron.MessageBoxOptions = {
        type: 'question',
        buttons: ['Chiqish','Bekor qilish'],
        defaultId: 0,
        title: 'Ilovadan chiqing',
        message: 'Haqiqatan ham ilovadan chiqmoqchimisiz?',
        cancelId: 5,
      };
  
      dialog.showMessageBox(win!, options).then((response) => {
        console.log(response.response);
        if (response.response === 0) {
          closeboll = true
          app.quit();
        }else{
          closeboll = false
        }
      });
    }
  });
  
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  console.log(process.env)
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
app.on('browser-window-focus', () => {
  globalShortcut.register('CommandOrControl+R', () => {
    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  })
})
app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R');
});
app.commandLine.appendSwitch('ignore-certificate-errors');
app.on('ready',async () => {
  await autoUpdater.checkForUpdates()
})
autoUpdater.on('update-downloaded', async (info) => {
  const options: Electron.MessageBoxOptions = {
    type: 'question',
    buttons: ['Yang'],
    title: "Eng so'nggi versiya yuklangan",
    message: "Eng so'nggi versiya yuklangan",
    defaultId: 0,
    cancelId: 0,
  };

  dialog.showMessageBox(win!, options).then((response) => {
    if(response.response === 0){
      autoUpdater.quitAndInstall()
    }
  });
  // dialog.showMessageBox({
  //   type: 'question',
  //   buttons: ['Обновлять'],
  //   message: 'Последняя версия загружена',
  //   defaultId: 0,
  // }).then(res => {
  //   if(res.response === 0){
  //     autoUpdater.quitAndInstall()
  //   }
  // })
})

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
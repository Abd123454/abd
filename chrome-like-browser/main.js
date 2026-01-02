const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the HTML interface
  mainWindow.loadFile('index.html');

  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();
}

// Create the browser window when Electron is ready
app.whenReady().then(() => {
  createWindow();

  // Create a simple menu bar
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'New Window', accelerator: 'CmdOrCtrl+N' },
        { type: 'separator' },
        { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: () => mainWindow.webContents.reload() },
        { label: 'Toggle Developer Tools', accelerator: 'F12', click: () => mainWindow.webContents.toggleDevTools() }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', click: () => mainWindow.minimize() },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', click: () => mainWindow.close() }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
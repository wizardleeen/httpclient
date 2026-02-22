import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron';
import * as path from 'path';

const isDev = process.env.NODE_ENV === 'development';

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    height: 900,
    width: 1400,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for HTTP requests
ipcMain.handle('make-http-request', async (event, requestConfig) => {
  const axios = require('axios');
  try {
    const response = await axios(requestConfig);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config
    };
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
      response: error.response ? {
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers
      } : null
    };
  }
});

// Menu template
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Request',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          BrowserWindow.getFocusedWindow()?.webContents.send('new-request');
        }
      },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'About HTTP Client',
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://github.com/wizardleeen/httpclient');
        }
      }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template as any));
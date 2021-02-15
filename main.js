const electron = require('electron');

const workspace = require('./workspace');

const BrowserWindow     = electron.BrowserWindow;
const app               = electron.app;
const ipc               = electron.ipcMain;

function main () {
    const mainWindow = new BrowserWindow({
      width: 1920,
      height: 960,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true
      }
    });
  
    mainWindow.loadFile('index.html');

    const list = workspace.readWorkingDir();

    console.log('LIST: ', list);
}
  
app.whenReady().then(main);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        main();
    }
});
const electron          = require('electron');
const path              = require('path');

const confModule        = require('./conf_module/.');
const fileModule        = require('./file_module/.');
// const workspace = require('./workspace');

const BrowserWindow     = electron.BrowserWindow;
const app               = electron.app;
const ipc               = electron.ipcMain;


const workingDir = path.join(__dirname, 'TestWorkspace');

function main () {
    // Check conf setup curr/new one
    confModule.configure();

    // Main window
    const mainWindow = new BrowserWindow({
      width: 1920,
      height: 960,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true
      }
    });
    mainWindow.loadFile('index.html');
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

// IPC

ipc.on('explorer:get-list', (e) => {
    fsStats = fileModule.readDir(workingDir);
    e.reply('explorer:setup-list', {...fsStats});
});
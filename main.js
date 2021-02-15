const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

const fileModule = require('./file_module/.');

const ipc = ipcMain;
const testDir = path.join(__dirname, 'TestWorkspace');

let mainWindow;

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
  if (mainWindow === null) createWindow()
});

// IPC

ipc.on('explorer:get-list', (event) => {
    console.log('IPC MAIN [explorer:get-list]');
    event.reply( 'explorer:setup-list', fileModule.readDir(testDir) );
});

ipc.on('explorer:select-list-item', (event, data) => {
    console.log('IPC MAIN [explorer:select-list-item] data: ', data);
});
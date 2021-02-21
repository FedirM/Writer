const { 
  BrowserWindow,
  Menu,
  ipcMain,
  app
}                   = require('electron');

const path          = require('path');

const config        = require('./conf_module/.');
const fileModule    = require('./file_module/.');

const ipc = ipcMain;
const testDir = path.join(__dirname, 'TestWorkspace');
let showSnakbarSaveStatus = true;

config.openProject( testDir );

let mainWindow, modalWindow;

function createWindow() {
  config.showConfig();
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
  mainWindow.on('closed',  () => { mainWindow = null });


  createNewFileModal();
}

function createNewFileModal() {
  modalWindow = new BrowserWindow({
    width: 700,
    height: 550,
    // frame: false,
    // resizable: false,
    // modal: true,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  modalWindow.loadFile('./modal_window/new_file/newfile.html');
  modalWindow.webContents.openDevTools();
  modalWindow.on('closed',  () => {modal = null});
}

function createMenu() {
  const recentProjects = config.getRecentProjects().map((el) => {
    return { label: path.basename(el.pwd), click: openRecentProject }
  });
  const menuTempl = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          click: () => { console.log('New file') }
        },
        {
          type: 'separator'
        },
        {
          label: 'Open Project',
          click: openProject
        },
        {
          label: 'Open Recent',
          submenu: [...recentProjects]
        },
        {
          type: 'separator'
        },
        {
          label: 'Save File',
          click: saveCurrFile
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          click: quit
        }
      ]
    }
  ];


  const menu = Menu.buildFromTemplate( menuTempl );
  Menu.setApplicationMenu( menu );
}

function openProject() {
  config.openProject( fileModule.openDir() );
  readProjectFiles();
}

function openRecentProject(menuItem) {
  let conf = config.getRecentProjectByName( menuItem.label );
  config.openProject( conf.pwd );
  readProjectFiles();
}

function openCurrFile() {
  let res = {};
  res.openFilePath =path.join(
    config.getCurrProjectSettings().pwd,
    config.getCurrProjectSettings().currFile + '.json'
  );
  res.fileData = fileModule.readFile(res.openFilePath);
  mainWindow.webContents.send('editor:setupFile', {...res});
}

function saveCurrFile() {
  mainWindow.webContents.send('editor:get-data');
}

function readProjectFiles() {
  console.log('ReadProjectFiles conf: ', config.getCurrProjectSettings());
  mainWindow.webContents.send(
    'explorer:setup-list',
    fileModule.readDir(config.getCurrProjectSettings().pwd)
  );
  
  openCurrFile();
}


function quit() {
  showSnakbarSaveStatus = false;
  saveCurrFile();
  config.saveConfig();
  app.quit();
}

app.on('before-quit', (event) => {
  console.log('before-quit INSTRUCTION');
  quit();
});

app.on('ready', () => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow()
});

// IPC
// Snakbar

ipc.on('snakbar:error', (event, message) => {
  mainWindow.webContents.send('snakbar:error', message);
});

ipc.on('snakbar:message', (event, message) => {
  mainWindow.webContents.send('snakbar:message', message);
});

// EDITOR

ipc.on('explorer:get-list', () => {
    readProjectFiles();
});

ipc.on('explorer:select-list-item', (event, data) => {
  // console.log('IPC MAIN [explorer:select-list-item] data: ', data);
  config.setCurrWorkingFile( data.fileName );
  openCurrFile();
});

ipc.on('editor:save', (event, data) => {
  let projectSettings = config.getCurrProjectSettings();
  if( !projectSettings.currFile || !projectSettings.pwd ) return;
  let saveRes = fileModule.saveFile(
    path.join(projectSettings.pwd, projectSettings.currFile + '.json'),
    data
  );
  if( showSnakbarSaveStatus ){
    event.reply('edito:saveStatus', saveRes);
  }
});

// NEWFILE module window
ipc.on('newfile:close-window-save', (event, args) => {
  console.log('NEWFILE: ', args);
  modalWindow.close();
});
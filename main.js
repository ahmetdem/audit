const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 400,
    minHeight: 300,
    titleBarStyle: 'hidden',
    // resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      
    },
  });

  // open dev tools
  mainWindow.webContents.openDevTools();

  mainWindow.loadFile('./html/mainpage.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Listen for the 'quit-app' message from the renderer process
ipcMain.on('quit-app', () => {
  console.log("Received quit-app message");
  quitApp();
});

// Add this function to quit the app
function quitApp() {
  app.quit();
}

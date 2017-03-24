/* Require electron */
global.electron = require('electron');

/* Electron init */
global.app = electron.app;
global.BrowserWindow = electron.BrowserWindow;
global.mainWindow = "";

/* Functions */
function createWindow(){
    mainWindow = new BrowserWindow({width: 1000, height: 750});
    mainWindow.loadURL('file://'+__dirname+'/desktop/index.html');
    mainWindow.setMenu(null);
    mainWindow.on('closed', function(){
        mainWindow = null;
    });
}

/* App setup */
app.on('ready', createWindow);
app.on('window-all-closed', function(){
    if (process.platform !== 'darwin') app.quit()
});
app.on('activate', function(){
    if (mainWindow === null) createWindow()
});

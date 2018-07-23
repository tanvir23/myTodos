const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit());
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('addTodo', (event, todo) => {
    mainWindow.webContents.send('receivedNewTodo', todo);
    addWindow.close();
});
function createAddWindow() {
    addWindow = new BrowserWindow({
        height: 200,
        width: 300,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

function clearTodos() {
    mainWindow.webContents.send('clearTodos');
}

const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: 'New Todo',
                accelerator: process.platform === 'darwin'
                    ? 'Command+N' : 'Ctrl+N',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Todos',
                accelerator: process.platform === 'darwin'
                    ? 'Command+Backspace' : 'Ctrl+Delete',
                click() {
                    clearTodos();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin'
                    ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Debug',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Dev Tools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                },
                accelerator: process.platform === 'darwin'
                    ? 'Command+Alt+I': 'Ctrl+Shift+I'
            }
        ]
    })
}
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { Menu } from 'electron';

function buildMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu:new'),
        },
        {
          label: 'Open...',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu:open'),
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu:save'),
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow?.webContents.send('menu:save-as'),
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false, // don't show until ready
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  if (process.platform === 'darwin') {
    buildMenu(); // keep native menu on macOS only
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// --- File IPC handlers ---
ipcMain.handle('file:open', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    filters: [{ name: 'Fountain', extensions: ['fountain'] }],
    properties: ['openFile'],
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const filePath = result.filePaths[0];
  const content = await fs.readFile(filePath, 'utf-8');
  return { filePath, content };
});

ipcMain.handle(
  'file:save',
  async (_e, { filePath, content }: { filePath: string; content: string }) => {
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  },
);

ipcMain.handle('file:saveAs', async (_e, content: string) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    filters: [{ name: 'Fountain', extensions: ['fountain'] }],
  });
  if (result.canceled || !result.filePath) return null;
  await fs.writeFile(result.filePath, content, 'utf-8');
  return result.filePath;
});

ipcMain.handle('file:checkUnsavedAndNew', async (_e, isDirty: boolean) => {
  if (isDirty) {
    const result = await dialog.showMessageBox(mainWindow!, {
      type: 'warning',
      buttons: ['Discard Changes', 'Cancel'],
      defaultId: 1,
      cancelId: 1,
      message: 'You have unsaved changes. Start a new file anyway?',
    });
    if (result.response === 1) return false; // cancelled
  }
  return true; // proceed
});

ipcMain.handle('file:readPath', async (_e, filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { filePath, content };
  } catch {
    return null; // file moved/deleted/inaccessible
  }
});

ipcMain.handle(
  'file:exportPdf',
  async (
    _e,
    {
      titlePageHtml,
      scriptHtml,
      suggestedName,
    }: {
      titlePageHtml: string;
      scriptHtml: string;
      suggestedName: string;
    },
  ) => {
    const result = await dialog.showSaveDialog(mainWindow!, {
      defaultPath: `${suggestedName}.pdf`,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (result.canceled || !result.filePath) return null;

    const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  @page { size: letter; margin: 0; }
  body { font-family: 'Courier Prime', 'Courier New', monospace; font-size: 12pt; color: #000;
         margin: 1in 1in 1in 1.5in; }
  h3 { text-transform: uppercase; font-weight: bold; margin: 1.5em 0 0.5em; }
  h2 { text-align: right; text-transform: uppercase; font-weight: bold; margin: 1.5em 0 0.5em; }
  p { margin: 0 0 1em; }
  p.centered { text-align: center; }
  .dialogue { width: 60%; margin: 0 auto 1em; }
  .dialogue h4 { text-align: center; text-transform: uppercase; margin: 0 0 0.2em; font-weight: bold; }
  .dialogue p.parenthetical { text-align: center; font-style: italic; width: 70%; margin: 0 auto 0.2em; }
  .title-page { height: 9in; display: flex; flex-direction: column; justify-content: center; align-items: center;
                text-align: center; page-break-after: always; }
</style></head><body>
  <div class="title-page">${titlePageHtml}</div>
  ${scriptHtml}
</body></html>`;

    const pdfWindow = new BrowserWindow({ show: false });
    await pdfWindow.loadURL(
      'data:text/html;charset=utf-8,' + encodeURIComponent(fullHtml),
    );
    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'Letter',
    });
    await fs.writeFile(result.filePath, pdfBuffer);
    pdfWindow.close();

    return result.filePath;
  },
);

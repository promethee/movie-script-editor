import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  readPath: (filePath: string) => ipcRenderer.invoke('file:readPath', filePath),
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('file:save', { filePath, content }),
  saveFileAs: (content: string) => ipcRenderer.invoke('file:saveAs', content),
  onMenuOpen: (cb: () => void) => ipcRenderer.on('menu:open', cb),
  onMenuSave: (cb: () => void) => ipcRenderer.on('menu:save', cb),
  onMenuSaveAs: (cb: () => void) => ipcRenderer.on('menu:save-as', cb),
  onMenuNew: (cb: () => void) => ipcRenderer.on('menu:new', cb),
  checkUnsavedAndNew: (isDirty: boolean) =>
    ipcRenderer.invoke('file:checkUnsavedAndNew', isDirty),
  exportPdf: (args: {
    titlePageHtml: string;
    scriptHtml: string;
    suggestedName: string;
  }) => ipcRenderer.invoke('file:exportPdf', args),
  removeMenuListeners: () => {
    ipcRenderer.removeAllListeners('menu:open');
    ipcRenderer.removeAllListeners('menu:save');
    ipcRenderer.removeAllListeners('menu:save-as');
    ipcRenderer.removeAllListeners('menu:new');
  },
});

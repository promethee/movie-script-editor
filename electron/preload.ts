import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('file:save', { filePath, content }),
  saveFileAs: (content: string) => ipcRenderer.invoke('file:saveAs', content),
  onMenuOpen: (cb: () => void) => ipcRenderer.on('menu:open', cb),
  onMenuSave: (cb: () => void) => ipcRenderer.on('menu:save', cb),
  onMenuSaveAs: (cb: () => void) => ipcRenderer.on('menu:save-as', cb),
  removeMenuListeners: () => {
    ipcRenderer.removeAllListeners('menu:open');
    ipcRenderer.removeAllListeners('menu:save');
    ipcRenderer.removeAllListeners('menu:save-as');
  },
});

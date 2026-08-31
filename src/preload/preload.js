const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (content) => ipcRenderer.invoke('dialog:saveFile', content),
  saveFileAs: (content) => ipcRenderer.invoke('dialog:saveFileAs', content),
  readFile: (path) => ipcRenderer.invoke('file:read', path),
  writeFile: ({ filePath, content }) => ipcRenderer.invoke('file:write', { filePath, content }),
});

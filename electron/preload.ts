import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  makeHttpRequest: (requestConfig: any) => ipcRenderer.invoke('make-http-request', requestConfig),
  onNewRequest: (callback: () => void) => ipcRenderer.on('new-request', callback),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
});
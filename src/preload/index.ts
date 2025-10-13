import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ProcessOptions } from 'src/main/FileStore'

// Custom APIs for renderer
const api = {
  file: {
    store: (filename: string, buffer: Uint8Array) =>
      ipcRenderer.invoke('file:store', filename, buffer),
    getInfo: () => ipcRenderer.invoke('file:getInfo'),
    process: (operation: 'encrypt' | 'decrypt', options: ProcessOptions) =>
      ipcRenderer.invoke('file:process', operation, options),
    clear: () => ipcRenderer.invoke('file:clear')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

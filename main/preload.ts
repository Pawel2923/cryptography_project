import { contextBridge, ipcRenderer } from "electron";

type OnEventListenerType = (event: Electron.IpcRendererEvent, ...args: []) => void;

contextBridge.exposeInMainWorld("electronAPI", {
    on: (channel: string, callback: OnEventListenerType) => {
        ipcRenderer.on(channel, callback);
    },
    send: (channel: string, ...args: []) => {
        ipcRenderer.send(channel, args);
    }
})

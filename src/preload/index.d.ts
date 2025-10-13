import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      file: {
        store: (
          filename: string,
          buffer: Uint8Array
        ) => Promise<{
          success: boolean
          FileData?: { name: string; size: number; path: string }
          error?: string
        }>
        getInfo: () => Promise<{
          success: boolean
          FileData?: { name: string; size: number; path: string }
          error?: string
        }>
        process: (
          operation: 'encrypt' | 'decrypt',
          options: object
        ) => Promise<{
          success: boolean
          filePath?: string
          error?: string
        }>
        clear: () => Promise<{ success: boolean }>
      }
    }
  }
}

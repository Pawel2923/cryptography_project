import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      file: {
        store: (filePath: string) => Promise<{
          success: boolean
          fileInfo?: { name: string; size: number; path: string }
          error?: string
        }>
        getInfo: () => Promise<{
          success: boolean
          fileInfo?: { name: string; size: number; path: string }
          error?: string
        }>
        process: (
          operation: 'encrypt' | 'decrypt',
          options: object
        ) => Promise<{
          success: boolean
          result?: Buffer
          originalName?: string
          error?: string
        }>
        clear: () => Promise<{ success: boolean }>
      }
    }
  }
}

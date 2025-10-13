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
          options: ProcessOptions
        ) => Promise<{
          success: boolean
          filePath?: string
          error?: string
        }>
        clear: () => Promise<{ success: boolean }>
        download: (filePath?: string) => Promise<{ success: boolean; error?: string }>
        preview: (filePath?: string) => Promise<{ success: boolean; error?: string }>
      }
    }
  }
}

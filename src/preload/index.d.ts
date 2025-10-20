import { ElectronAPI } from '@electron-toolkit/preload'
import { Result } from '@shared/result-util'

type FileData = {
  name: string
  size: number
  path: string
  length?: number
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      file: {
        store: (filename: string, buffer: Uint8Array) => Promise<Result<FileData, string>>
        getInfo: () => Promise<Result<FileData, string>>
        process: (
          operation: 'encrypt' | 'decrypt',
          options: ProcessOptions
        ) => Promise<Result<string, string>>
        clear: () => Promise<Result<boolean, string>>
        download: (filePath?: string) => Promise<Result<boolean, string>>
        preview: (filePath?: string) => Promise<Result<boolean, string>>
      }
    }
  }
}

import { ipcMain } from 'electron'
import fs from 'fs/promises'
import { FileData, fileStore } from './FileStore'

type FileInfo = Omit<NonNullable<FileData>, 'buffer'>

type FileHandlerReturnType =
  | { success: true; fileInfo: FileInfo }
  | { success: false; error: string }

type FileProcessReturnType =
  | { success: true; result: Buffer; originalName: string }
  | { success: false; error: string }

export function setupFileHandlers(): void {
  ipcMain.handle('file:store', async (_event, filePath: string): Promise<FileHandlerReturnType> => {
    try {
      const stats = await fs.stat(filePath)
      const buffer = await fs.readFile(filePath)

      const fileData: NonNullable<FileData> = {
        path: filePath,
        name: filePath.split(/[/\\]/).pop() || 'unknown',
        size: stats.size,
        buffer
      }

      fileStore.setFileData(fileData)

      return {
        success: true,
        fileInfo: { path: fileData.path, name: fileData.name, size: fileData.size }
      }
    } catch (error) {
      console.error('Error storing file:', error)
      return { success: false, error: 'Failed to store file' }
    }
  })

  ipcMain.handle('file:getInfo', (): FileHandlerReturnType => {
    const fileData = fileStore.getFileData()

    if (!fileData) {
      return { success: false, error: 'No file stored' }
    }

    return {
      success: true,
      fileInfo: {
        name: fileData.name,
        size: fileData.size,
        path: fileData.path
      }
    }
  })

  ipcMain.handle(
    'file:process',
    async (
      _event,
      operation: 'encrypt' | 'decrypt',
      options: object
    ): Promise<FileProcessReturnType> => {
      const fileData = fileStore.getFileData()

      if (!fileData || !fileData.buffer) {
        return { success: false, error: 'No file to process' }
      }

      try {
        //TODO: Integrate with native module

        console.log(`Processing file: ${fileData.name} with operation: ${operation}`)
        console.log('Options:', options)

        //TODO: Replace with actual processing result
        const processedBuffer = fileData.buffer

        return {
          success: true,
          result: processedBuffer,
          originalName: fileData.name
        }
      } catch (error) {
        console.error('Error processing file:', error)
        return { success: false, error: 'Processing failed' }
      }
    }
  )

  ipcMain.handle('file:clear', () => {
    fileStore.clearFileData()
    return { success: true }
  })
}

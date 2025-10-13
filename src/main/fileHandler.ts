import { ipcMain } from 'electron'
import fs from 'fs/promises'
import { FileData, fileStore, ProcessOptions } from './FileStore'
import { createRequire } from 'module'
import path from 'path'

const require = createRequire(import.meta.url)
const rustCrypto = require('../../rust_crypto/index.node') as {
  encrypt: (filepath: string, key: string) => string
  decrypt: (filePath: string, key: string) => string
}
const { encrypt, decrypt } = rustCrypto

type FileHandlerReturnType =
  | { success: true; FileData: FileData }
  | { success: false; error: string }

type FileProcessReturnType = { success: true; filePath: string } | { success: false; error: string }

export function setupFileHandlers(app: Electron.App): void {
  ipcMain.handle(
    'file:store',
    async (_event, filename: string, buffer: Uint8Array): Promise<FileHandlerReturnType> => {
      try {
        const filePath = path.join(app.getPath('temp'), filename)
        await fs.writeFile(filePath, buffer)

        const stats = await fs.stat(filePath)

        const fileData = {
          path: filePath,
          name: filePath.split(/[/\\]/).pop() || 'unknown',
          size: stats.size
        }

        fileStore.setFileData(fileData)

        return {
          success: true,
          FileData: { path: fileData.path, name: fileData.name, size: fileData.size }
        }
      } catch (error) {
        console.error('Error storing file:', error)
        return { success: false, error: 'Failed to store file' }
      }
    }
  )

  ipcMain.handle('file:getInfo', (): FileHandlerReturnType => {
    const fileData = fileStore.getFileData()

    console.log('file:getInfo called, current fileData:', fileData)

    if (!fileData) {
      return { success: false, error: 'No file stored' }
    }

    return {
      success: true,
      FileData: {
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
      options: ProcessOptions
    ): Promise<FileProcessReturnType> => {
      const fileData = fileStore.getFileData()

      if (
        !fileData ||
        !fileData.path ||
        !options.key ||
        (await fs.stat(fileData.path).catch(() => false)) === false
      ) {
        return { success: false, error: 'No file to process' }
      }

      try {
        let result: string = ''

        switch (operation) {
          case 'encrypt':
            result = encrypt(fileData.path, options.key)
            break
          case 'decrypt':
            result = decrypt(fileData.path, options.key)
            break
          default:
            console.error('Invalid operation:', operation)
            return { success: false, error: 'Invalid operation' }
        }

        const processedStats = await fs.stat(result)

        const oldFilePath = fileData.path
        fileStore.setFileData({
          name: path.basename(result),
          path: result,
          size: processedStats.size
        })

        try {
          await fs.unlink(oldFilePath)
        } catch (error) {
          console.warn('Warning: Could not delete original file:', error)
        }

        console.log('Processed file created:', result)
        return { success: true, filePath: result }
      } catch (error) {
        console.error('Error processing file:', error)
        return { success: false, error: 'Processing failed' }
      }
    }
  )

  ipcMain.handle('file:clear', async () => {
    const fileData = fileStore.getFileData()
    if (fileData) {
      try {
        await fs.unlink(fileData.path)
      } catch (err) {
        console.error('Error deleting file:', err)
      }
    }

    fileStore.clearFileData()
    return { success: true }
  })

  ipcMain.handle(
    'file:download',
    async (_event, filePath?: string): Promise<{ success: boolean; error?: string }> => {
      try {
        let targetPath = filePath
        if (!targetPath) {
          const fileData = fileStore.getFileData()
          console.log('file:download - fileData from store:', fileData)
          if (!fileData) {
            return { success: false, error: 'No file available for download' }
          }
          targetPath = fileData.path
        }

        console.log('file:download - attempting to read file:', targetPath)
        const data = await fs.readFile(targetPath)
        console.log('file:download - file read successfully, size:', data.length)

        const { dialog } = require('electron')
        const { canceled, filePath: savePath } = await dialog.showSaveDialog({
          defaultPath: path.basename(targetPath)
        })

        if (canceled || !savePath) {
          return { success: false, error: 'Save operation was cancelled' }
        }

        await fs.writeFile(savePath, data)
        console.log('file:download - file saved successfully to:', savePath)
        return { success: true }
      } catch (error) {
        console.error('Error downloading file:', error)
        return { success: false, error: 'Failed to download file' }
      }
    }
  )

  ipcMain.handle(
    'file:preview',
    async (_event, filePath?: string): Promise<{ success: boolean; error?: string }> => {
      try {
        let targetPath = filePath
        if (!targetPath) {
          const fileData = fileStore.getFileData()
          console.log('file:preview - fileData from store:', fileData)
          if (!fileData) {
            return { success: false, error: 'No file available for preview' }
          }
          targetPath = fileData.path
        }

        console.log('file:preview - attempting to read file:', targetPath)
        const data = await fs.readFile(targetPath)
        console.log('file:preview - file read successfully, size:', data.length)

        const { shell } = require('electron')
        const tempPreviewPath = path.join(
          app.getPath('temp'),
          `preview_${path.basename(targetPath)}`
        )
        await fs.writeFile(tempPreviewPath, data)
        console.log('file:preview - preview file created:', tempPreviewPath)
        await shell.openPath(tempPreviewPath)
        return { success: true }
      } catch (error) {
        console.error('Error previewing file:', error)
        return { success: false, error: 'Failed to preview file' }
      }
    }
  )
}

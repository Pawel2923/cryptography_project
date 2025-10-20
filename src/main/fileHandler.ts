import { ipcMain } from 'electron'
import fs from 'fs/promises'
import { FileData, fileStore, ProcessOptions } from './FileStore'
import { createRequire } from 'module'
import path from 'path'
import { Result, ok, err } from '../shared/result-util'

const require = createRequire(import.meta.url)
const rustCrypto = require('../../rust_crypto/index.node') as {
  encrypt: (filepath: string, key: string, algorithm: string) => string
  decrypt: (filePath: string, key: string, algorithm: string) => string
}
const { encrypt, decrypt } = rustCrypto

export function setupFileHandlers(app: Electron.App): void {
  ipcMain.handle(
    'file:store',
    async (_event, filename: string, buffer: Uint8Array): Promise<Result<FileData, string>> => {
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

        return ok({ path: fileData.path, name: fileData.name, size: fileData.size })
      } catch (error) {
        console.error('Error storing file:', error)
        return err('Nie udało się zapisać pliku')
      }
    }
  )

  ipcMain.handle('file:getInfo', async (): Promise<Result<FileData, string>> => {
    try {
      const fileData = fileStore.getFileData()

      if (!fileData) {
        return err('Brak zapisanego pliku')
      }

      const text = await fs.readFile(fileData.path, 'utf-8')

      return ok({
        name: fileData.name,
        size: fileData.size,
        path: fileData.path,
        length: text.length
      })
    } catch (error) {
      console.error('Error getting file info:', error)
      return err('Nie udało się pobrać informacji o pliku')
    }
  })

  ipcMain.handle(
    'file:process',
    async (
      _event,
      operation: 'encrypt' | 'decrypt',
      options: ProcessOptions
    ): Promise<Result<string, string>> => {
      const fileData = fileStore.getFileData()

      if (
        !fileData ||
        !fileData.path ||
        !options.key ||
        !options.algorithm ||
        (await fs.stat(fileData.path).catch(() => false)) === false
      ) {
        return err('Brak pliku do przetworzenia')
      }

      try {
        let result: string = ''

        switch (operation) {
          case 'encrypt':
            result = encrypt(fileData.path, options.key, options.algorithm)
            break
          case 'decrypt':
            result = decrypt(fileData.path, options.key, options.algorithm)
            break
          default:
            console.error('Invalid operation:', operation)
            return err('Nieprawidłowa operacja')
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
        return ok(result)
      } catch (error) {
        console.error('Error processing file:', error)
        return err('Przetwarzanie nie powiodło się')
      }
    }
  )

  ipcMain.handle('file:clear', async (): Promise<Result<boolean, string>> => {
    const fileData = fileStore.getFileData()
    if (fileData) {
      try {
        await fs.unlink(fileData.path)
      } catch (err) {
        console.error('Error deleting file:', err)
      }
    }

    fileStore.clearFileData()
    return ok(true)
  })

  ipcMain.handle(
    'file:download',
    async (_event, filePath?: string): Promise<Result<boolean, string>> => {
      try {
        let targetPath = filePath
        if (!targetPath) {
          const fileData = fileStore.getFileData()
          console.log('file:download - fileData from store:', fileData)
          if (!fileData) {
            return err('Brak pliku do pobrania')
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
          return err('Operacja zapisu została anulowana')
        }

        await fs.writeFile(savePath, data)
        console.log('file:download - file saved successfully to:', savePath)
        return ok(true)
      } catch (error) {
        console.error('Error downloading file:', error)
        return err('Nie udało się pobrać pliku')
      }
    }
  )

  ipcMain.handle(
    'file:preview',
    async (_event, filePath?: string): Promise<Result<boolean, string>> => {
      try {
        let targetPath = filePath
        if (!targetPath) {
          const fileData = fileStore.getFileData()
          console.log('file:preview - fileData from store:', fileData)
          if (!fileData) {
            return err('Brak pliku do podglądu')
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
        return ok(true)
      } catch (error) {
        console.error('Error previewing file:', error)
        return err('Nie udało się wyświetlić podglądu pliku')
      }
    }
  )
}

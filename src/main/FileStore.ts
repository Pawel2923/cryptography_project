export type FileData = {
  path: string
  name: string
  size: number
  length?: number
} | null

export type ProcessOptions = {
  key: string
  algorithm: string
}

class FileStore {
  private fileData: FileData = null

  setFileData(data: FileData): void {
    this.fileData = data
  }

  getFileData(): FileData {
    return this.fileData
  }

  clearFileData(): void {
    this.fileData = null
  }
}

export const fileStore = new FileStore()

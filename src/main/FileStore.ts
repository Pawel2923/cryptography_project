export type FileData = {
  path: string
  name: string
  size: number
  buffer?: Buffer
} | null

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

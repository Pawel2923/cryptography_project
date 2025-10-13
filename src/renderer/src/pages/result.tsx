import { Button } from '@renderer/components/ui/button'

export default function ResultPage(): React.ReactNode {
  const downloadResult = async (): Promise<void> => {
    try {
      const download = await window.api.file.download()
      if (download.success) {
        console.log('File downloaded successfully')
      } else {
        console.error('Error downloading file:', download.error)
      }
    } catch (error) {
      console.error('Error downloading result:', error)
    }
  }

  const previewResult = async (): Promise<void> => {
    try {
      const preview = await window.api.file.preview()
      if (!preview.success) {
        console.error('Error previewing file:', preview.error)
      } else {
        console.log('File previewed successfully')
      }
    } catch (error) {
      console.error('Error previewing result:', error)
    }
  }

  const clearFile = async (): Promise<void> => {
    try {
      await window.api.file.clear()
      console.log('File cleared successfully')
    } catch (error) {
      console.error('Error clearing file:', error)
    }
  }

  return (
    <div>
      <p>Wynik</p>
      <Button onClick={downloadResult}>Pobierz</Button>
      <Button onClick={previewResult}>Podgląd</Button>
      <Button onClick={clearFile} variant="destructive">
        Wyczyść plik
      </Button>
    </div>
  )
}

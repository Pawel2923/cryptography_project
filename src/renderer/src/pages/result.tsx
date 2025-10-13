import Header from '@renderer/components/Header'
import Main from '@renderer/components/Main'
import { Button } from '@renderer/components/ui/button'
import { TypographyH1 } from '@renderer/components/ui/typography'
import { ArrowDownToLine, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function ResultPage(): React.ReactNode {
  const navigate = useNavigate()

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
      navigate('/')
    } catch (error) {
      console.error('Error clearing file:', error)
    }
  }

  return (
    <>
      <Header>
        <TypographyH1>Wynik operacji</TypographyH1>
      </Header>
      <Main className="flex-col gap-6">
        <div className="flex gap-4">
          <Button onClick={downloadResult}>
            <ArrowDownToLine aria-hidden="true" />
            Pobierz
          </Button>
          <Button onClick={previewResult} variant="outline">
            <ExternalLink aria-hidden="true" />
            Podgląd
          </Button>
        </div>
        <Button onClick={clearFile} variant="destructive">
          Powróć do ekranu głównego
        </Button>
      </Main>
    </>
  )
}

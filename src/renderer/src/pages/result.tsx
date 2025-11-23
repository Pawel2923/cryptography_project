import Header from '@renderer/components/Header'
import Main from '@renderer/components/Main'
import { Button } from '@renderer/components/ui/button'
import { TypographyH1 } from '@renderer/components/ui/typography'
import { useTitle } from '@renderer/hooks/useTitle'
import { ArrowDownToLine, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import LogsDialog from '@renderer/components/LogsDialog'

export default function ResultPage(): React.ReactNode {
  useTitle('Wynik operacji')
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const downloadResult = async (): Promise<void> => {
    try {
      setErrorMessage(null)
      const download = await window.api.file.download()
      if (download.ok) {
        console.log('File downloaded successfully')
      } else {
        const message = download.error || 'Nie udało się pobrać pliku'
        console.error('Error downloading file:', message)
        setErrorMessage(message)
      }
    } catch (error) {
      console.error('Error downloading result:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas pobierania pliku')
    }
  }

  const previewResult = async (): Promise<void> => {
    try {
      setErrorMessage(null)
      const preview = await window.api.file.preview()
      if (!preview.ok) {
        const message = preview.error || 'Nie udało się wyświetlić podglądu pliku'
        console.error('Error previewing file:', message)
        setErrorMessage(message)
      } else {
        console.log('File previewed successfully')
      }
    } catch (error) {
      console.error('Error previewing result:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas wyświetlania podglądu')
    }
  }

  const clearFile = async (): Promise<void> => {
    try {
      setErrorMessage(null)
      await window.api.file.clear()
      console.log('File cleared successfully')

      await window.api.logs.clear()
      console.log('Logs cleared successfully')

      navigate('/')
    } catch (error) {
      console.error('Error clearing file:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas czyszczenia pliku')
    }
  }

  return (
    <>
      <Header>
        <TypographyH1>Wynik operacji</TypographyH1>
      </Header>
      <Main className="flex-col gap-6">
        {errorMessage && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-destructive">{errorMessage}</p>
          </div>
        )}
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
        <LogsDialog />
        <Button onClick={clearFile} variant="destructive">
          Powróć do ekranu głównego
        </Button>
      </Main>
    </>
  )
}

import Header from '@renderer/components/Header'
import Main from '@renderer/components/Main'
import { Button } from '@renderer/components/ui/button'
import { TypographyH1 } from '@renderer/components/ui/typography'
import { useTitle } from '@renderer/hooks/useTitle'
import { ArrowDownToLine, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import LogsDialog from '@renderer/components/LogsDialog'
import { useResult } from '@renderer/hooks/useResult'

export default function ResultPage(): React.ReactNode {
  useTitle('Wynik operacji')
  const { downloadResult, previewResult, clearFile, errorMessage } = useResult()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent): void => {
      if (isDialogOpen) {
        return
      }

      if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        downloadResult()
      }

      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault()
        previewResult()
      }
    }

    window.addEventListener('keydown', keyDownHandler)

    return (): void => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [clearFile, downloadResult, isDialogOpen, previewResult])

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
          <Button onClick={downloadResult} title="Pobierz plik (Ctrl+S)">
            <ArrowDownToLine aria-hidden="true" />
            Pobierz
          </Button>
          <Button
            onClick={previewResult}
            variant="outline"
            title="Otwórz podgląd w domyślnej aplikacji (Spacja)"
          >
            <ExternalLink aria-hidden="true" />
            Podgląd
          </Button>
        </div>
        <LogsDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
        <Button onClick={clearFile} variant="destructive">
          Powróć do ekranu głównego
        </Button>
      </Main>
    </>
  )
}

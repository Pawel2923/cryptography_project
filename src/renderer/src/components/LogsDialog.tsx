import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { Copy, Download, Check, FileText } from 'lucide-react'
import { useLogs } from '@renderer/hooks/useLogs'
import { useEffect } from 'react'

interface LogsDialogProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function LogsDialog({ isOpen, setIsOpen }: LogsDialogProps): React.ReactNode {
  const {
    logs,
    fetchLogs,
    loading,
    errorMessage,
    setErrorMessage,
    copied,
    copyToClipboard,
    saveToFile
  } = useLogs()

  useEffect(() => {
    fetchLogs()

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'l' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [fetchLogs, setIsOpen])

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      saveToFile()
    }

    if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      copyToClipboard()
    }
  }

  const dialogOpenChangeHandler = (isOpen: boolean): void => {
    if (!isOpen) {
      setErrorMessage(null)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={dialogOpenChangeHandler}>
      <DialogTrigger asChild>
        <Button variant="secondary" onClick={() => setIsOpen(true)} title="Zobacz logi (Ctrl+L)">
          <FileText aria-hidden="true" />
          Zobacz logi operacji
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col" onKeyDown={keyDownHandler}>
        <DialogHeader>
          <DialogTitle>Logi operacji</DialogTitle>
          <DialogDescription>
            Historia operacji szyfrowania i deszyfrowania wykonanych w tej sesji
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {loading && <p className="text-muted-foreground text-sm">Ładowanie logów...</p>}
          {errorMessage && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-md mb-4">
              <p className="text-destructive text-sm">{errorMessage}</p>
            </div>
          )}
          {!loading && logs && (
            <div className="relative h-full overflow-auto">
              <pre className="bg-muted p-4 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words">
                <code>{logs}</code>
              </pre>
            </div>
          )}
          {!loading && !errorMessage && !logs && (
            <p className="text-muted-foreground text-sm">Brak logów do wyświetlenia</p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            disabled={!logs || loading}
            title="Ctrl+C"
          >
            {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
            {copied ? 'Skopiowano!' : 'Kopiuj do schowka'}
          </Button>
          <Button variant="outline" onClick={saveToFile} disabled={!logs || loading} title="Ctrl+S">
            <Download className="mr-2" />
            Zapisz do pliku
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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

export default function LogsDialog(): React.ReactNode {
  const { logs, fetchLogs, loading, errorMessage, copied, copyToClipboard, saveToFile } = useLogs()

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <FileText aria-hidden="true" />
          Zobacz logi operacji
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
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
          {!loading && !errorMessage && logs && (
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
          <Button variant="outline" onClick={copyToClipboard} disabled={!logs || loading}>
            {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
            {copied ? 'Skopiowano!' : 'Kopiuj do schowka'}
          </Button>
          <Button variant="outline" onClick={saveToFile} disabled={!logs || loading}>
            <Download className="mr-2" />
            Zapisz do pliku
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

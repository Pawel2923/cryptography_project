import { useId } from 'react'
import { Button } from './ui/button'
import { ClipboardPaste } from 'lucide-react'
import { useClipboard } from '@renderer/hooks/useClipboard'
import { toast } from 'sonner'

interface PasteButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  setPastedValue: (value: string) => void
  errorHandler?: (error: string) => void
}

export function PasteButton({
  setPastedValue,
  errorHandler,
  ...props
}: PasteButtonProps): React.ReactNode {
  const labelId = `paste-button-label-${useId()}`
  const { readLastCopiedText } = useClipboard()

  const clickHandler = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    const result = await readLastCopiedText()
    if (result.ok) {
      setPastedValue(result.value)
    } else {
      errorHandler?.(result.error)
      toast.error('Nie udało się wczytać tekstu ze schowka')
    }

    props.onClick?.(event)
  }

  return (
    <Button
      variant="outline"
      onClick={clickHandler}
      {...props}
      aria-labelledby={labelId}
      title={props.title || 'Wklej ze schowka'}
    >
      <ClipboardPaste aria-hidden="true" aria-labelledby={labelId} />
      <div id={labelId} className="sr-only">
        Wklej ze schowka
      </div>
    </Button>
  )
}

import { useId } from 'react'
import { Button } from './ui/button'
import { ClipboardCopy } from 'lucide-react'
import { toast } from 'sonner'

interface CopyButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  valueToCopy: string
}

export function CopyButton({ valueToCopy, ...props }: CopyButtonProps): React.ReactNode {
  const labelId = `copy-button-label-${useId()}`

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {
    try {
      navigator.clipboard.writeText(valueToCopy)

      props.onClick?.(event)
      toast.success('Skopiowano do schowka')
    } catch (error) {
      console.error('Encountered an error while copying to clipboard:', error)
      toast.error('Nie udało się skopiować do schowka')
    }
  }

  return (
    <Button
      variant="outline"
      onClick={clickHandler}
      {...props}
      aria-labelledby={labelId}
      title={props.title || 'Kopiuj do schowka'}
    >
      <ClipboardCopy aria-hidden="true" aria-labelledby={labelId} />
      <div id={labelId} className="sr-only">
        Kopiuj do schowka
      </div>
    </Button>
  )
}

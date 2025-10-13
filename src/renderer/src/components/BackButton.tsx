import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from './ui/button'

export function BackButton({ onClick }: { onClick?: () => void }): React.ReactNode {
  const navigate = useNavigate()

  const clickHandler = (): void => {
    if (onClick) {
      onClick()
      return
    }

    navigate(-1)
  }

  return (
    <Button
      onClick={clickHandler}
      variant="outline"
      className="w-fit fixed top-4 left-4 z-10"
      title="Powróć do poprzedniej strony"
    >
      <ChevronLeft aria-hidden="true" />
      Powrót
    </Button>
  )
}

import React, { useId, useState } from 'react'
import { FileUp } from 'lucide-react'
import { TypographyLabel } from '../ui/typography'
import { FILE_CONTAINER_CLASSES } from '../constants'
import { useLocation, useNavigate } from 'react-router'

export default function FileContainer({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>): React.ReactNode {
  const labelId = useId()
  const navigate = useNavigate()
  const location = useLocation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      setErrorMessage(null)
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      const result = await window.api.file.store(file.name, uint8Array)

      if (result.ok) {
        navigate(`${location.pathname}/algorithms`)
      } else {
        const message = result.error || 'Nie udało się zapisać pliku'
        console.error('Error storing file:', message)
        setErrorMessage(message)
      }
    } catch (error) {
      console.error('Error storing file:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas zapisywania pliku')
    }
  }

  return (
    <>
      <div className={FILE_CONTAINER_CLASSES} {...rest}>
        <input
          type="file"
          className="absolute top-0 left-0 w-full h-full opacity-0"
          aria-labelledby={labelId}
          onChange={changeHandler}
        />
        <div id={labelId} className="flex flex-col justify-center items-center pointer-events-none">
          <FileUp size={64} aria-hidden="true" />
          <TypographyLabel>Wybierz plik z dysku</TypographyLabel>
        </div>
      </div>
      {errorMessage && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-destructive">{errorMessage}</p>
        </div>
      )}
    </>
  )
}

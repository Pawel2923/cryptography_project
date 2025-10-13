import React, { useId } from 'react'
import { FileUp } from 'lucide-react'
import { TypographyLabel } from '../ui/typography'
import { FILE_CONTAINER_CLASSES } from './constants'
import { useLocation, useNavigate } from 'react-router'

export default function FileContainer({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>): React.ReactNode {
  const labelId = useId()
  const navigate = useNavigate()
  const location = useLocation()

  const changeHandler = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    await window.api.file.store(file.name, uint8Array)

    navigate(`${location.pathname}/algorithms`)
  }

  return (
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
  )
}

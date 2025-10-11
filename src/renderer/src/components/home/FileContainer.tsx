import React, { useId } from 'react'
import { FileUp } from 'lucide-react'
import { TypographyLabel } from '../ui/typography'
import { FILE_CONTAINER_CLASSES } from './constants'

export default function FileContainer({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>): React.ReactNode {
  const labelId = useId()

  return (
    <div className={FILE_CONTAINER_CLASSES} {...rest}>
      <input
        type="file"
        className="absolute top-0 left-0 w-full h-full opacity-0"
        aria-labelledby={labelId}
      />
      <div id={labelId} className="flex flex-col justify-center items-center pointer-events-none">
        <FileUp size={64} aria-hidden="true" />
        <TypographyLabel>Wybierz plik z dysku</TypographyLabel>
      </div>
    </div>
  )
}

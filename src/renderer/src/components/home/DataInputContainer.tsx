import React, { useId } from 'react'
import { Button } from '../ui/button'

type FileProps = {
  containerType: 'file'
} & React.ButtonHTMLAttributes<HTMLDivElement>

type TextProps = {
  containerType: 'text'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

type DataInputContainerProps = FileProps | TextProps

const baseClasses =
  'flex flex-col relative justify-center items-center min-h-80 aspect-square p-4 gap-4 text-text-secondary rounded border border-border-primary hover:shadow-hovered hover:text-accent transition'

export default function DataInputContainer({
  containerType,
  children,
  ...rest
}: DataInputContainerProps): React.ReactNode {
  const labelId = useId()

  return containerType === 'file' ? (
    <div
      className={`${baseClasses} has-[:focus-visible]:border-primary has-[:focus-visible]:ring-primary/50 has-[:focus-visible]:ring-[3px]`}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    >
      <input
        type="file"
        className="absolute top-0 left-0 w-full h-full opacity-0"
        aria-labelledby={labelId}
      />
      <div id={labelId} className="flex flex-col justify-center items-center pointer-events-none">
        {children}
      </div>
    </div>
  ) : (
    <Button
      className={baseClasses}
      variant="none"
      size="none"
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </Button>
  )
}

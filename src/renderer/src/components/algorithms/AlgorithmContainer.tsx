import React from 'react'
import { TypographyLabel } from '../ui/typography'
import { Button } from '../ui/button'
import { LockKeyhole } from 'lucide-react'
import { CONTAINER_BASE_CLASSES } from '../constants'

type AlgorithmContainerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export default function AlgorithmContainer({
  children,
  icon,
  ...rest
}: AlgorithmContainerProps): React.ReactNode {
  const IconComponent = icon || LockKeyhole

  return (
    <Button className={CONTAINER_BASE_CLASSES} variant="none" {...rest}>
      <IconComponent size={64} aria-hidden="true" />
      <TypographyLabel>{children}</TypographyLabel>
    </Button>
  )
}

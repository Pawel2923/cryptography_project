import React from 'react'
import { TypographyLabel } from '../ui/typography'
import { LockKeyhole } from 'lucide-react'
import { CONTAINER_BASE_CLASSES } from '../constants'
import { Link } from 'react-router'

type AlgorithmContainerProps = React.ComponentPropsWithoutRef<typeof Link> & {
  children: React.ReactNode
  to: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  description?: string
}

export default function AlgorithmContainer({
  children,
  to,
  icon,
  description,
  ...rest
}: AlgorithmContainerProps): React.ReactNode {
  const IconComponent = icon || LockKeyhole

  return (
    <Link to={to} className={CONTAINER_BASE_CLASSES} {...rest}>
      <IconComponent size={64} aria-hidden="true" />
      <TypographyLabel>{children}</TypographyLabel>
      <TypographyLabel>{description}</TypographyLabel>
    </Link>
  )
}

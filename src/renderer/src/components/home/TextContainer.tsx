import React from 'react'
import { Type } from 'lucide-react'
import { TypographyLabel } from '../ui/typography'
import { Button } from '../ui/button'
import { CONTAINER_BASE_CLASSES } from './constants'

export default function TextContainer({
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>): React.ReactNode {
  return (
    <Button className={CONTAINER_BASE_CLASSES} variant="none" size="none" {...rest}>
      <Type size={64} aria-hidden="true" />
      <TypographyLabel>Wpisz lub wklej tekst</TypographyLabel>
    </Button>
  )
}

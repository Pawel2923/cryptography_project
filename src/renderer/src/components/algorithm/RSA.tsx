import React from 'react'
import { CipherProps } from './cipher-props'
import { TypographyLabel } from '../ui/typography'

export default function RSA({ description }: CipherProps): React.ReactNode {
  return <>{description && <TypographyLabel>{description}</TypographyLabel>}</>
}

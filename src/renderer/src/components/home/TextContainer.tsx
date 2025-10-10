import React from 'react'
import DataInputContainer from './DataInputContainer'
import { Type } from 'lucide-react'
import { TypographyLabel } from '../ui/typography'

export default function FileContainer(): React.ReactNode {
  return (
    <DataInputContainer containerType="text">
      <Type size={64} aria-hidden="true" />
      <TypographyLabel>Wpisz lub wklej tekst</TypographyLabel>
    </DataInputContainer>
  )
}

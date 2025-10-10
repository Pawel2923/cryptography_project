import React from 'react'
import DataInputContainer from './DataInputContainer'
import { FileUp } from 'lucide-react'
import { TypographyLabel } from '../ui/typography'

export default function FileContainer(): React.ReactNode {
  return (
    <DataInputContainer to="/file">
      <FileUp size={64} aria-hidden="true" />
      <TypographyLabel>Wybierz plik z dysku</TypographyLabel>
    </DataInputContainer>
  )
}

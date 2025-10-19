import AlgorithmContainer from '@renderer/components/algorithms/AlgorithmContainer'
import { BackButton } from '@renderer/components/BackButton'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@renderer/components/ui/select'
import Header from '@renderer/components/Header'
import Main from '@renderer/components/Main'
import { TypographyH1 } from '@renderer/components/ui/typography'
import { useTitle } from '@renderer/hooks/useTitle'
import { getAlgorithms } from '@renderer/lib/algorithm-util'
import React, { useState } from 'react'

const algorithms = getAlgorithms()

export default function AlgorithmsPage({
  operation
}: {
  operation: 'encrypt' | 'decrypt'
}): React.ReactNode {
  const [selectedOperation, setSelectedOperation] = useState(operation)

  useTitle(
    `Wybierz algorytm - ${selectedOperation === 'encrypt' ? 'Szyfrowanie' : 'Deszyfrowanie'}`
  )

  const valueChangeHandler = (value: string): void => {
    setSelectedOperation(value as 'encrypt' | 'decrypt')
  }

  return (
    <>
      <BackButton />
      <Header className="flex-col">
        <TypographyH1>Wybierz algorytm</TypographyH1>
        <Select defaultValue={selectedOperation} onValueChange={valueChangeHandler}>
          <SelectTrigger>
            <SelectValue placeholder="Wybierz operację" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="encrypt">Szyfrowanie</SelectItem>
            <SelectItem value="decrypt">Deszyfrowanie</SelectItem>
          </SelectContent>
        </Select>
      </Header>
      <Main layout="grid" className="grid-cols-3">
        {algorithms.map((alg) => (
          <AlgorithmContainer
            to={`/${selectedOperation}/algorithm/${alg.id}`}
            key={alg.id}
            icon={alg.icon}
          >
            {alg.name}
          </AlgorithmContainer>
        ))}
      </Main>
    </>
  )
}

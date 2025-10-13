import AlgorithmContainer from '@renderer/components/algorithms/AlgorithmContainer'
import Header from '@renderer/components/Header'
import Main from '@renderer/components/Main'
import { TypographyH1 } from '@renderer/components/ui/typography'
import { getAlgorithms } from '@renderer/lib/algorithm-util'
import React from 'react'

const algorithms = getAlgorithms()

export default function AlgorithmsPage({
  operation
}: {
  operation: 'encrypt' | 'decrypt'
}): React.ReactNode {
  return (
    <>
      <Header>
        <TypographyH1>Wybierz algorytm</TypographyH1>
      </Header>
      <Main layout="grid" className="grid-cols-3">
        {algorithms.map((alg) => (
          <AlgorithmContainer to={`${operation}/algorithm/${alg.id}`} key={alg.id} icon={alg.icon}>
            {alg.name}
          </AlgorithmContainer>
        ))}
      </Main>
    </>
  )
}

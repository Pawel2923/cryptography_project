import CaesarCipher from '@renderer/components/algorithm/CaesarCipher'
import Header from '@renderer/components/Header'
import Main from '@renderer/components/Main'
import { Button } from '@renderer/components/ui/button'
import { TypographyH1 } from '@renderer/components/ui/typography'
import { getAlgorithm } from '@renderer/lib/algorithm-util'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function AlgorithmPage({
  operation
}: {
  operation: 'encrypt' | 'decrypt'
}): React.ReactNode {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [key, setKey] = useState<string>('')
  const [isValid, setIsValid] = useState<boolean>(false)

  const algorithmNotImplemented = (
    <div className="p-4 text-destructive">Alrgorytm nie jest zaimplementowany</div>
  )

  const algorithm = getAlgorithm(id || '')
  if (!algorithm) {
    return algorithmNotImplemented
  }

  const runAlgorithm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    if (!isValid || !algorithm.id || !key) {
      console.error('Invalid options')
      return
    }

    try {
      console.log('Running algorithm:', event.currentTarget.id)

      const result = await window.api.file.process(operation, {
        key,
        algorithm: algorithm.id
      })
      if (result.success) {
        console.log('Algorithm result:', result.filePath)
        navigate(`/result`)
      } else {
        console.error('Error processing file:', result.error)
        await window.api.file.clear()
      }
    } catch (error) {
      console.error('Error running algorithm:', error)
      await window.api.file.clear()
    }
  }

  const algorithmComponent =
    algorithm.id === 'caesar-cipher' ? (
      <CaesarCipher description={algorithm.description} setKey={setKey} setIsValid={setIsValid} />
    ) : (
      algorithmNotImplemented
    )

  return (
    <>
      <Header>
        <TypographyH1>
          {algorithm.name} - {operation === 'encrypt' ? 'Szyfrowanie' : 'Deszyfrowanie'}
        </TypographyH1>
      </Header>
      <Main className="flex-col md:max-w-3/4 mx-auto text-center">
        <form onSubmit={runAlgorithm} className="grid gap-6">
          {algorithmComponent}
          <Button type="submit" disabled={!isValid}>
            Uruchom
          </Button>
        </form>
      </Main>
    </>
  )
}

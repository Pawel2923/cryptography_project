import { BackButton } from '@renderer/components/BackButton'
import Header from '@renderer/components/Header'
import Main from '@renderer/components/Main'
import { Button } from '@renderer/components/ui/button'
import { TypographyH1 } from '@renderer/components/ui/typography'
import { useTitle } from '@renderer/hooks/useTitle'
import { getAlgorithm, getAlgorithmComponent } from '@renderer/lib/algorithm-util'
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const algorithmNotImplemented = (
    <div className="p-4 text-destructive">Alrgorytm nie jest zaimplementowany</div>
  )

  const algorithm = getAlgorithm(id || '')

  useTitle(
    operation === 'encrypt'
      ? `${algorithm?.name ? `${algorithm.name} - ` : ''}Szyfrowanie`
      : `${algorithm?.name ? `${algorithm.name} - ` : ''}Deszyfrowanie`
  )

  if (!algorithm) {
    return algorithmNotImplemented
  }

  const runAlgorithm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    if (!isValid || !algorithm.id || !key) {
      console.error('Invalid options')
      setErrorMessage('Nieprawidłowe opcje. Sprawdź czy klucz jest poprawny.')
      return
    }

    try {
      console.log('Running algorithm:', event.currentTarget.id)
      setErrorMessage(null)

      const result = await window.api.file.process(operation, {
        key,
        algorithm: algorithm.id
      })
      if (result.ok) {
        console.log('Algorithm result:', result.value)
        navigate(`/result`)
      } else {
        const message = result.error || 'Przetwarzanie nie powiodło się'
        console.error('Error processing file:', message)
        setErrorMessage(message)
        await window.api.file.clear()
      }
    } catch (error) {
      console.error('Error running algorithm:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas przetwarzania pliku')
      await window.api.file.clear()
    }
  }

  const mappedComponent = getAlgorithmComponent(algorithm.id, {
    description: algorithm.description,
    operation,
    setKey,
    setIsValid
  })

  const algorithmComponent = mappedComponent || algorithmNotImplemented

  return (
    <>
      <BackButton />
      <Header>
        <TypographyH1>
          {algorithm.name} - {operation === 'encrypt' ? 'Szyfrowanie' : 'Deszyfrowanie'}
        </TypographyH1>
      </Header>
      <Main className="flex-col md:max-w-3/4 mx-auto text-center">
        {errorMessage && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
            <p className="text-destructive">{errorMessage}</p>
          </div>
        )}
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

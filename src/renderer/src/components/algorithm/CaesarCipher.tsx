import React, { useState, useEffect } from 'react'
import { CipherProps } from './cipher-props'
import { Input } from '@renderer/components/ui/input'
import { Field, FieldLabel } from '../ui/field'
import { TypographyLabel } from '../ui/typography'
import { err, ok, Result } from '@shared/result-util'

function validateKey(key: string): Result<boolean, string> {
  if (!key || key.length === 0) {
    return err('Klucz jest wymagany')
  }

  const intValue = parseInt(key, 10)
  if (isNaN(intValue)) {
    return err('Klucz musi być liczbą')
  }

  if (intValue < 1 || intValue > 25) {
    return err('Klucz musi być liczbą od 1 do 25')
  }

  return ok(true)
}

export default function CaesarCipher({
  description,
  setKey,
  setIsValid
}: CipherProps): React.ReactNode {
  const [keyValue, setKeyValue] = useState('')
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const result = validateKey(keyValue)

    if (result.ok) {
      setKey(keyValue)
      setIsValid(true)
      if (hasInteracted) {
        setValidationMessage(null)
      }
    } else {
      setIsValid(false)
      if (hasInteracted) {
        setValidationMessage(result.error)
      }
    }
  }, [keyValue, setIsValid, setKey, hasInteracted])

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setHasInteracted(true)
    setKeyValue(value)
  }

  return (
    <>
      {description && <TypographyLabel>{description}</TypographyLabel>}
      <Field className="text-center">
        <FieldLabel htmlFor="caesar-key">Klucz (1-25)</FieldLabel>
        <Input
          id="caesar-key"
          type="number"
          min={1}
          max={25}
          placeholder="Wprowadź klucz"
          onChange={changeHandler}
          value={keyValue}
        />
      </Field>
      {validationMessage && <p className="text-destructive">{validationMessage}</p>}
    </>
  )
}

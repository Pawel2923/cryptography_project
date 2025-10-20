import React, { useState, useEffect } from 'react'
import { Field, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { TypographyLabel } from '../ui/typography'
import { CipherProps } from './cipher-props'
import { err, ok, Result } from '@shared/result-util'

function validateKey(key: string): Result<boolean, string> {
  if (!key || key.length === 0) {
    return err('Klucz jest wymagany')
  }

  if (!/^[a-zA-Z]+$/.test(key)) {
    return err('Klucz musi składać się wyłącznie z liter alfabetu')
  }

  if (key.length < 2) {
    return err('Klucz musi składać się z co najmniej dwóch liter')
  }

  return ok(true)
}

export default function VigenereCipher({
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
      <Field className="text-center">
        {description && <TypographyLabel>{description}</TypographyLabel>}
        <FieldLabel htmlFor="vigenere-key">Klucz (litery)</FieldLabel>
        <Input
          type="text"
          id="vigenere-key"
          minLength={2}
          placeholder="Wprowadź klucz"
          onChange={changeHandler}
          value={keyValue}
        />
      </Field>
      {validationMessage && <p className="text-destructive">{validationMessage}</p>}
    </>
  )
}

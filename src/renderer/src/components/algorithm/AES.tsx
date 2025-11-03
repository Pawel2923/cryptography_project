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

  const requiredLength = 16
  const keyBytes = new TextEncoder().encode(key).length

  if (keyBytes !== requiredLength) {
    return err(`Klucz musi mieć dokładnie ${requiredLength} bajtów (AES-128)`)
  }

  return ok(true)
}

export default function AES({ description, setKey, setIsValid }: CipherProps): React.ReactNode {
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
      <div className="text-sm text-muted-foreground mb-2">
        Tryb: GCM (Galois/Counter Mode) z autentykacją
      </div>
      <Field className="text-center">
        <FieldLabel htmlFor="aes-key">Klucz (16 bajtów dla AES-128)</FieldLabel>
        <Input
          id="aes-key"
          type="text"
          placeholder="Wprowadź klucz (16 bajtów)"
          onChange={changeHandler}
          value={keyValue}
          maxLength={16}
        />
      </Field>
      {validationMessage && <p className="text-destructive">{validationMessage}</p>}
    </>
  )
}

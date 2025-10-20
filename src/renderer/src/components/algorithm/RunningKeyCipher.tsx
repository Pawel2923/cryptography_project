import React, { useEffect, useState } from 'react'
import { Field, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { TypographyLabel } from '../ui/typography'
import { CipherProps } from './cipher-props'
import { Textarea } from '../ui/textarea'
import { err, ok, Result } from '@shared/result-util'

async function validateKey(key?: string | null): Promise<Result<boolean, string>> {
  if (!(typeof key === 'string' && /^[a-zA-Z]+$/.test(key) && key.length >= 2)) {
    return err('Klucz musi składać się z co najmniej dwóch liter alfabetu.')
  }

  const res = await window.api.file.getInfo()
  if (!res.ok) {
    return err(res.error || 'Nie można zweryfikować długości klucza z pliku.')
  }

  if (res.value.length && res.value.length > key.length) {
    return err('Klucz jest krótszy niż tekst w pliku. Wybierz inny klucz.')
  }

  return ok(true)
}

export default function RunningKeyCipher({
  description,
  setKey,
  setIsValid
}: CipherProps): React.ReactNode {
  const [keyValue, setKeyValue] = useState('')
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    async function validate(): Promise<void> {
      const normalizedKey = keyValue.replace(/[^a-zA-Z]/g, '')
      const result = await validateKey(normalizedKey)

      if (result.ok) {
        setKey(normalizedKey)
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
    }

    validate()
  }, [keyValue, setIsValid, setKey, hasInteracted])

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value
    setHasInteracted(true)
    setKeyValue(value)
  }

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) {
      setIsValid(false)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const key = event.target?.result as string
      setHasInteracted(true)
      setKeyValue(key)
    }

    reader.readAsText(file)
  }

  return (
    <>
      <Field className="text-center">
        {description && <TypographyLabel>{description}</TypographyLabel>}
        <p>Wprowadź klucz ręcznie lub załaduj z pliku tekstowego</p>
        <FieldLabel htmlFor="running-key">Klucz (fragment tekstu)</FieldLabel>
        <Textarea
          id="running-key"
          minLength={2}
          placeholder="Wprowadź klucz"
          onChange={changeHandler}
          value={keyValue}
          className="wrap-anywhere h-32 overflow-y-auto"
        ></Textarea>
      </Field>
      <Field className="text-center">
        <FieldLabel htmlFor="running-key-file">Klucz z pliku tekstowego.</FieldLabel>
        <Input type="file" accept=".txt" id="running-key-file" onChange={fileChangeHandler} />
      </Field>
      {validationMessage && <p className="text-destructive">{validationMessage}</p>}
    </>
  )
}

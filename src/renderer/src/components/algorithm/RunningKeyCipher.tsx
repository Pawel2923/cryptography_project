import React, { useEffect } from 'react'
import { Field, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { TypographyLabel } from '../ui/typography'
import { CipherProps } from './cipher-props'
import { Textarea } from '../ui/textarea'

export default function RunningKeyCipher({
  description,
  setKey,
  setIsValid
}: CipherProps): React.ReactNode {
  const [keyValue, setKeyValue] = React.useState('')

  useEffect(() => {
    if (keyValue && /^[a-zA-Z]+$/.test(keyValue) && keyValue.length >= 2) {
      setKey(keyValue)
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }, [keyValue, setIsValid, setKey])

  const replaceNonAlphabetic = (value: string): string => {
    return value.replace(/[^a-zA-Z]/g, '')
  }

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value
    setKeyValue(replaceNonAlphabetic(value))
  }

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (!file) {
      setIsValid(false)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const key = replaceNonAlphabetic(event.target?.result as string)
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
    </>
  )
}

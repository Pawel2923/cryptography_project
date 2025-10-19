import React from 'react'
import { Field, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { TypographyLabel } from '../ui/typography'
import { CipherProps } from './cipher-props'

export default function VigenereCipher({
  description,
  setKey,
  setIsValid
}: CipherProps): React.ReactNode {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setKey(value)
    const isValid = /^[a-zA-Z]+$/.test(value) && value.length >= 2
    setIsValid(isValid)
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
        />
      </Field>
    </>
  )
}

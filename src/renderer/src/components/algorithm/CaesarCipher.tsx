import React from 'react'
import { CipherProps } from './cipher-props'
import { Input } from '@renderer/components/ui/input'
import { Field, FieldLabel } from '../ui/field'
import { TypographyLabel } from '../ui/typography'

export default function CaesarCipher({
  description,
  setKey,
  setIsValid
}: CipherProps): React.ReactNode {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setKey(value)
    const intValue = parseInt(value, 10)
    setIsValid(!isNaN(intValue) && intValue >= 1 && intValue <= 25)
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
        />
      </Field>
    </>
  )
}

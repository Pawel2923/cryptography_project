import { useState } from 'react'

interface UseTextFormOptions {
  minLength?: number
  maxLength?: number
  required?: boolean
}

interface UseTextFormReturn {
  textValue: string
  errors: string[]
  hasErrors: boolean
  handleTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  handlePaste: (pastedText: string | null) => void
  handleReset: () => void
  handleSubmit: (event: React.FormEvent) => boolean
  validateText: (text: string) => string[]
}

export function useTextForm(options: UseTextFormOptions = {}): UseTextFormReturn {
  const { minLength = 3, maxLength, required = true } = options

  const [textValue, setTextValue] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const validateText = (text: string): string[] => {
    const validationErrors: string[] = []

    if (required && (!text || text.trim().length === 0)) {
      validationErrors.push('To pole jest wymagane')
    } else if (text.length > 0 && text.length < minLength) {
      validationErrors.push(`Tekst musi mieć co najmniej ${minLength} znaki`)
    }

    if (maxLength && text.length > maxLength) {
      validationErrors.push(`Tekst nie może być dłuższy niż ${maxLength} znaków`)
    }

    return validationErrors
  }

  const clearErrorsIfValid = (text: string): void => {
    if (errors.length > 0 && text.length >= minLength) {
      setErrors([])
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value
    setTextValue(value)
    clearErrorsIfValid(value)
  }

  const handlePaste = (pastedText: string | null): void => {
    if (pastedText) {
      setTextValue(pastedText)
      clearErrorsIfValid(pastedText)
    } else {
      setErrors(['Nie udało się odczytać zawartości schowka'])
    }
  }

  const handleReset = (): void => {
    setTextValue('')
    setErrors([])
  }

  const handleSubmit = (event: React.FormEvent): boolean => {
    event.preventDefault()

    const form = event.target as HTMLFormElement

    // HTML validation check
    if (!form.checkValidity()) {
      const textInput = form.elements.namedItem('text') as HTMLTextAreaElement

      if (textInput.validity.valueMissing) {
        setErrors(['To pole jest wymagane'])
      } else if (textInput.validity.tooShort) {
        setErrors([`Tekst musi mieć co najmniej ${textInput.minLength} znaki`])
      } else if (textInput.validity.tooLong) {
        setErrors([`Tekst nie może być dłuższy niż ${textInput.maxLength} znaków`])
      } else {
        setErrors(['Wprowadzone dane są nieprawidłowe'])
      }
      return false
    }

    // Custom validation
    const validationErrors = validateText(textValue)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return false
    }

    setErrors([])
    return true
  }

  return {
    textValue,
    errors,
    hasErrors: errors.length > 0,
    handleTextChange,
    handlePaste,
    handleReset,
    handleSubmit,
    validateText
  }
}

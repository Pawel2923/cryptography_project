import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldTitle
} from '@renderer/components/ui/field'
import { Textarea } from '@renderer/components/ui/textarea'
import TextContainer from './TextContainer'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Button } from '@renderer/components/ui/button'
import { ClipboardPaste, Trash } from 'lucide-react'
import { Label } from '@renderer/components/ui/label'
import { useClipboard } from '@renderer/hooks/useClipboard'

export default function TextDialog(): React.ReactNode {
  const { readLastCopiedText } = useClipboard()
  const [textareaValue, setTextareaValue] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const pasteBtnClickHandler = async (): Promise<void> => {
    const text = await readLastCopiedText()
    if (text) {
      setTextareaValue(text)
      if (errors.length > 0 && text.length >= 3) {
        setErrors([])
      }
    } else {
      setErrors(['Nie udało się odczytać zawartości schowka'])
    }
  }

  const textareaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTextareaValue(event.target.value)

    if (errors.length > 0 && event.target.value.length >= 3) {
      setErrors([])
    }
  }

  const validateText = (text: string): string[] => {
    const validationErrors: string[] = []

    if (!text || text.trim().length === 0) {
      validationErrors.push('To pole jest wymagane')
    } else if (text.length < 3) {
      validationErrors.push('Tekst musi mieć co najmniej 3 znaki')
    }

    return validationErrors
  }

  const submitHandler = (event: React.FormEvent): void => {
    event.preventDefault()

    const form = event.target as HTMLFormElement
    if (!form.checkValidity()) {
      const textInput = form.elements.namedItem('text') as HTMLTextAreaElement

      if (textInput.validity.valueMissing) {
        setErrors(['To pole jest wymagane'])
      } else if (textInput.validity.tooShort) {
        setErrors(['Tekst musi mieć co najmniej 3 znaki'])
      } else {
        setErrors(['Wprowadzone dane są nieprawidłowe'])
      }
      return
    }

    const validationErrors = validateText(textareaValue)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors([])
    const data = new FormData(event.target as HTMLFormElement)
    console.log('Submitted text:', data.get('text'))
  }

  const resetHandler = (): void => {
    setTextareaValue('')
    setErrors([])
  }

  const hasErrors = errors.length > 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <TextContainer />
      </DialogTrigger>
      <DialogContent className="max-h-screen">
        <DialogHeader>
          <DialogTitle>Przetwarzanie tekstu</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler} onReset={resetHandler} className="grid gap-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldTitle className="justify-between">
                  <Label htmlFor="text">Tekst</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={pasteBtnClickHandler}
                      aria-label="Wklej tekst ze schowka"
                      title="Wklej ze schowka"
                    >
                      <ClipboardPaste aria-hidden="true" />
                      <span className="sr-only">Wklej ze schowka</span>
                    </Button>
                    <Button
                      type="reset"
                      variant="destructive"
                      aria-label="Wyczyść pole tekstowe"
                      title="Wyczyść pole tekstowe"
                    >
                      <Trash aria-hidden="true" />
                      <span className="sr-only">Wyczyść pole tekstowe</span>
                    </Button>
                  </div>
                </FieldTitle>
                <Textarea
                  id="text"
                  name="text"
                  required
                  minLength={3}
                  value={textareaValue}
                  onChange={textareaChangeHandler}
                  aria-invalid={hasErrors}
                />
                <DialogDescription asChild>
                  <FieldDescription>Wprowadź lub wklej tekst do przetworzenia</FieldDescription>
                </DialogDescription>
                {hasErrors && (
                  <FieldError
                    id="text-error"
                    errors={errors.map((error) => ({ message: error }))}
                  />
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Anuluj</Button>
            </DialogClose>
            <Button type="submit" disabled={hasErrors && textareaValue.length > 0}>
              Potwierdź
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

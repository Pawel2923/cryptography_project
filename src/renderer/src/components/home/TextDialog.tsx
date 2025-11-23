import React, { useId } from 'react'
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
import { useTextForm } from '@renderer/hooks/useTextForm'
import { useLocation, useNavigate } from 'react-router'

export default function TextDialog(): React.ReactNode {
  const navigate = useNavigate()
  const location = useLocation()
  const filenameId = useId()
  const { readLastCopiedText } = useClipboard()
  const { textValue, errors, hasErrors, handleTextChange, handlePaste, handleReset, handleSubmit } =
    useTextForm({ minLength: 3, required: true })

  const pasteBtnClickHandler = async (): Promise<void> => {
    const result = await readLastCopiedText()
    if (result.ok) {
      handlePaste(result.value)
    } else {
      handlePaste(null)
    }
  }

  const submitHandler = (event: React.FormEvent): void => {
    const isValid = handleSubmit(event)
    if (!isValid) {
      return
    }

    const data = new FormData(event.target as HTMLFormElement)
    const text = data.get('text') as string
    console.log('Submitted text:', text)

    const buffer = new TextEncoder().encode(text)
    window.api.file.store(`text-${filenameId}.txt`, buffer)

    navigate(`${location.pathname}/algorithms`)
  }

  const onDialogOpenChange = (open: boolean): void => {
    if (!open) {
      handleReset()
    }
  }

  const keyDownHandler = (event: React.KeyboardEvent<HTMLFormElement>): void => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      event.currentTarget.requestSubmit()
    }

    if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      pasteBtnClickHandler()
    }

    if (event.key === 'Backspace' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleReset()
    }
  }

  return (
    <Dialog onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <TextContainer />
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Przetwarzanie tekstu</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={submitHandler}
          onReset={handleReset}
          onKeyDown={keyDownHandler}
          className="grid gap-6"
        >
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
                      title="Wklej ze schowka (Ctrl+V)"
                    >
                      <ClipboardPaste aria-hidden="true" />
                      <span className="sr-only">Wklej ze schowka</span>
                    </Button>
                    <Button
                      type="reset"
                      variant="destructive"
                      aria-label="Wyczyść pole tekstowe"
                      title="Wyczyść pole tekstowe (Ctrl+Backspace)"
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
                  value={textValue}
                  onChange={handleTextChange}
                  aria-invalid={hasErrors}
                  className="h-16 overflow-y-auto"
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
            <Button type="submit" disabled={hasErrors && textValue.length > 0} title="Ctrl+Enter">
              Potwierdź
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

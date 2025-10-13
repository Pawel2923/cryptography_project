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
    const text = await readLastCopiedText()
    handlePaste(text)
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

  return (
    <Dialog onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <TextContainer />
      </DialogTrigger>
      <DialogContent className="max-h-screen">
        <DialogHeader>
          <DialogTitle>Przetwarzanie tekstu</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler} onReset={handleReset} className="grid gap-6">
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
                  value={textValue}
                  onChange={handleTextChange}
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
            <Button type="submit" disabled={hasErrors && textValue.length > 0}>
              Potwierdź
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import React, { useEffect, useState } from 'react'
import { CipherProps } from './cipher-props'
import { TypographyLabel } from '../ui/typography'
import { Field, FieldLabel, FieldTitle } from '../ui/field'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { ClipboardPaste } from 'lucide-react'
import { err, ok, Result } from '@shared/result-util'
import { useClipboard } from '@renderer/hooks/useClipboard'

type NormalizedKey = {
  n: string
  e?: string
  d?: string
}

function pickString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

function resolveNestedField(source: unknown, field: keyof NormalizedKey): string | undefined {
  if (!source || typeof source !== 'object') {
    return undefined
  }

  const record = source as Record<string, unknown>
  return pickString(record[field])
}

function validateKeyPayload(raw: string, operation: 'encrypt' | 'decrypt'): Result<string, string> {
  if (!raw || raw.trim().length === 0) {
    return err('Klucz RSA jest wymagany.')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return err('Klucz musi być poprawnym JSON-em.')
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return err('Klucz musi być obiektem JSON.')
  }

  const data = parsed as Record<string, unknown>
  const modulus =
    pickString(data.n) ??
    resolveNestedField(data.public, 'n') ??
    resolveNestedField(data.private, 'n')
  const publicExp = pickString(data.e) ?? resolveNestedField(data.public, 'e')
  const privateExp = pickString(data.d) ?? resolveNestedField(data.private, 'd')

  if (!modulus) {
    return err('Brakuje pola "n" (moduł).')
  }

  if (operation === 'encrypt' && !publicExp) {
    return err('Do szyfrowania wymagane jest pole "e" w kluczu publicznym.')
  }

  if (operation === 'decrypt' && !privateExp) {
    return err('Do deszyfrowania wymagane jest pole "d" w kluczu prywatnym.')
  }

  const normalized: NormalizedKey = { n: modulus }
  if (publicExp) {
    normalized.e = publicExp
  }
  if (privateExp) {
    normalized.d = privateExp
  }

  return ok(JSON.stringify(normalized))
}

export default function RSA({
  description,
  operation,
  setKey,
  setIsValid
}: CipherProps): React.ReactNode {
  const [keyValue, setKeyValue] = useState('')
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [bitLength, setBitLength] = useState(512)
  const [generatorMessage, setGeneratorMessage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { readLastCopiedText } = useClipboard()

  useEffect(() => {
    const result = validateKeyPayload(keyValue, operation)

    if (result.ok) {
      setKey(result.value)
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
  }, [keyValue, operation, setIsValid, setKey, hasInteracted])

  const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setHasInteracted(true)
    setKeyValue(event.target.value)
  }

  const pasteFromClipboard = async (): Promise<void> => {
    setHasInteracted(true)
    const result = await readLastCopiedText()

    if (result.ok) {
      setKeyValue(result.value)
      setGeneratorMessage('Wklejono klucz ze schowka.')
    } else {
      setValidationMessage(result.error)
      setIsValid(false)
    }
  }

  const fileHandler = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    const inputTarget = event.target
    if (!file) {
      inputTarget.value = ''
      return
    }

    try {
      const text = await file.text()
      setHasInteracted(true)
      setKeyValue(text)
      setGeneratorMessage(`Załadowano klucz z pliku "${file.name}".`)
    } catch (error) {
      console.error('Nie udało się odczytać pliku z kluczem RSA:', error)
      setValidationMessage('Nie udało się odczytać pliku z kluczem RSA.')
      setIsValid(false)
    } finally {
      inputTarget.value = ''
    }
  }

  const bitLengthChangeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.target.value)
    if (Number.isNaN(value)) {
      setBitLength(512)
    } else {
      setBitLength(value)
    }
  }

  const generateKeypair = async (): Promise<void> => {
    if (!window.api?.rsa?.generateKeypair) {
      setGeneratorMessage('Generowanie kluczy nie jest dostępne w tej wersji aplikacji.')
      return
    }

    const normalizedBits = Math.min(4096, Math.max(256, Math.floor(bitLength)))

    setIsGenerating(true)
    setGeneratorMessage(null)
    try {
      const response = await window.api.rsa.generateKeypair(normalizedBits)
      if (response.ok) {
        setKeyValue(response.value)
        setHasInteracted(true)
        setGeneratorMessage(
          `Wygenerowano klucze RSA (${normalizedBits} bitów). Możesz je edytować przed użyciem.`
        )
      } else {
        setGeneratorMessage(response.error || 'Nie udało się wygenerować kluczy RSA.')
      }
    } catch (error) {
      console.error('Nie udało się wygenerować kluczy RSA:', error)
      setGeneratorMessage('Wystąpił błąd podczas generowania kluczy RSA.')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveKeyToFile = async (): Promise<void> => {
    if (!window.api?.rsa?.saveKey) {
      setGeneratorMessage('Zapisywanie kluczy nie jest dostępne w tej wersji aplikacji.')
      return
    }

    const payload = keyValue.trim()
    if (!payload) {
      setValidationMessage('Brak danych klucza do zapisania.')
      return
    }

    const suggestedName =
      operation === 'encrypt'
        ? 'rsa-public-key.json'
        : operation === 'decrypt'
          ? 'rsa-private-key.json'
          : 'rsa-keypair.json'

    setIsSaving(true)
    setGeneratorMessage(null)
    try {
      const response = await window.api.rsa.saveKey(payload, suggestedName)
      if (response.ok) {
        setGeneratorMessage('Zapisano klucz w pliku JSON.')
      } else {
        setValidationMessage(response.error || 'Nie udało się zapisać klucza RSA.')
      }
    } catch (error) {
      console.error('Nie udało się zapisać klucza RSA:', error)
      setValidationMessage('Wystąpił błąd podczas zapisywania klucza RSA.')
    } finally {
      setIsSaving(false)
    }
  }

  const requirementMessage =
    operation === 'encrypt'
      ? 'Do szyfrowania potrzebujesz modułu "n" oraz eksponenta publicznego "e".'
      : 'Do deszyfrowania potrzebujesz modułu "n" oraz eksponenta prywatnego "d".'

  return (
    <>
      {description && <TypographyLabel>{description}</TypographyLabel>}
      <p className="text-sm text-muted-foreground mt-2 mb-4">
        {requirementMessage} Możesz wkleić JSON z kluczem, wczytać go z pliku lub wygenerować parę
        kluczy lokalnie w aplikacji.
      </p>
      <Field className="text-left">
        <FieldTitle className="justify-between">
          <Label htmlFor="rsa-key">Klucz RSA (JSON)</Label>
          <Button
            type="button"
            variant="outline"
            aria-label="Wklej klucz ze schowka"
            title="Wklej ze schowka"
            onClick={pasteFromClipboard}
          >
            <ClipboardPaste aria-hidden="true" />
            <span className="sr-only">Wklej ze schowka</span>
          </Button>
        </FieldTitle>
        <Textarea
          id="rsa-key"
          value={keyValue}
          onChange={changeHandler}
          className="h-40 font-mono max-w-[90vw]"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Obsługiwane są oba formaty: płaski obiekt{' '}
          <code>{'{ "n": "...", "e": "...", "d": "..." }'}</code> oraz wynik generatora{' '}
          <code>{'{ "public": { ... }, "private": { ... } }'}</code>.
        </p>
      </Field>
      <Field className="text-left">
        <FieldLabel htmlFor="rsa-key-file">Załaduj klucz z pliku JSON</FieldLabel>
        <Input
          id="rsa-key-file"
          type="file"
          accept=".json,application/json"
          onChange={fileHandler}
        />
      </Field>
      <Field className="text-left">
        <FieldLabel htmlFor="rsa-bit-length">Generator kluczy RSA</FieldLabel>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Input
            id="rsa-bit-length"
            type="number"
            min={256}
            max={4096}
            step={64}
            className="md:w-32"
            value={bitLength}
            onChange={bitLengthChangeHandler}
          />
          <Button type="button" onClick={generateKeypair} disabled={isGenerating}>
            {isGenerating ? 'Generowanie...' : 'Generuj klucze'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Klucze są generowane lokalnie i zawierają zarówno część publiczną, jak i prywatną.
        </p>
      </Field>
      <Field className="text-left">
        <FieldLabel htmlFor="rsa-save-key">Zapisz klucz w formacie JSON</FieldLabel>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <Button
            id="rsa-save-key"
            type="button"
            variant="outline"
            onClick={saveKeyToFile}
            disabled={isSaving || keyValue.trim().length === 0}
          >
            {isSaving ? 'Zapisywanie...' : 'Zapisz klucz jako JSON'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Użyj przycisku, aby pobrać aktualny klucz (np. wygenerowany lub zmodyfikowany) do pliku
          JSON.
        </p>
      </Field>
      {validationMessage && <p className="text-destructive">{validationMessage}</p>}
      {generatorMessage && <p className="text-sm text-muted-foreground">{generatorMessage}</p>}
    </>
  )
}

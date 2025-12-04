import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { TypographyH2, TypographyP } from './ui/typography'
import { CopyButton } from './CopyButton'
import { toast } from 'sonner'
import { PasteButton } from './PasteButton'

export default function ECDH(): React.ReactNode {
  const [keypair, setKeypair] = useState<{ private: string; public: string } | null>(null)
  const [peerPublicKey, setPeerPublicKey] = useState<string>('')
  const [sharedSecret, setSharedSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent): void => {
      if (!keypair?.public) {
        return
      }

      if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()

        navigator.clipboard.writeText(keypair.public)
        toast.success('Klucz publiczny skopiowany do schowka')
      }
    }

    window.addEventListener('keydown', keyDownHandler)

    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [keypair?.public])

  const generateKeys = async (): Promise<void> => {
    try {
      const result = await window.api.ecdh.generateKeypair()
      if (result.ok) {
        const keys = JSON.parse(result.value)
        setKeypair(keys)
        setError(null)
        setSharedSecret(null)
      } else {
        setError(result.error || 'Błąd generowania kluczy')
      }
    } catch (e) {
      console.error(e)
      setError('Wystąpił błąd podczas generowania kluczy')
    }
  }

  const computeSecret = async (): Promise<void> => {
    if (!keypair || !peerPublicKey) return

    try {
      const result = await window.api.ecdh.computeSharedSecret(keypair.private, peerPublicKey)
      if (result.ok) {
        setSharedSecret(result.value)
        setError(null)
      } else {
        setError(result.error || 'Błąd obliczania sekretu')
      }
    } catch (e) {
      console.error(e)
      setError('Wystąpił błąd podczas obliczania sekretu')
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <TypographyH2>Twoje klucze</TypographyH2>
          <Button onClick={generateKeys}>Generuj nową parę</Button>
        </div>

        {keypair && (
          <div className="grid gap-4 p-4 border border-border-primary rounded-lg bg-background-secondary/50">
            <div>
              <TypographyP className="text-text-subtle text-sm mb-1">
                Klucz publiczny (udostępnij ten klucz):
              </TypographyP>
              <div className="flex gap-2">
                <code className="flex-1 p-2 bg-background-primary rounded border border-border-primary break-all text-xs font-mono">
                  {keypair.public}
                </code>
                <CopyButton valueToCopy={keypair.public} title="Skopiuj klucz (Ctrl+C)" />
              </div>
            </div>
            <div>
              <TypographyP className="text-text-subtle text-sm mb-1">
                Klucz prywatny (zachowaj dla siebie):
              </TypographyP>
              <code className="block p-2 bg-background-primary rounded border border-border-primary break-all text-xs font-mono text-text-disabled">
                {keypair.private}
              </code>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <TypographyH2>Wymiana kluczy</TypographyH2>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-text-secondary" htmlFor="peerPublicKey">
            Klucz publiczny drugiej strony:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="peerPublicKey"
              value={peerPublicKey}
              onChange={(e) => setPeerPublicKey(e.target.value)}
              placeholder="Wklej klucz publiczny rozmówcy..."
              className="flex-1 p-2 rounded border border-border-primary bg-background-primary text-text-primary focus:border-primary outline-none transition"
            />
            <PasteButton setPastedValue={setPeerPublicKey} className="h-auto" />
          </div>
        </div>

        <Button
          onClick={computeSecret}
          disabled={!keypair || !peerPublicKey}
          className="w-full sm:w-auto self-end"
        >
          Oblicz wspólny sekret
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-md text-destructive">
          {error}
        </div>
      )}

      {sharedSecret && (
        <div className="flex flex-col gap-2 p-6 border border-primary/50 rounded-lg bg-primary/5 animate-in fade-in slide-in-from-bottom-4">
          <TypographyH2 className="text-primary">Wspólny sekret</TypographyH2>
          <TypographyP className="text-text-secondary">
            To jest wygenerowany wspólny klucz. Obie strony powinny otrzymać ten sam wynik.
          </TypographyP>
          <div className="flex gap-2 mt-2">
            <code className="flex-1 p-3 bg-background-primary rounded border border-primary/30 break-all font-mono text-primary">
              {sharedSecret}
            </code>
            <CopyButton
              valueToCopy={sharedSecret}
              title="Kopiuj wspólny sekret"
              className="h-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}

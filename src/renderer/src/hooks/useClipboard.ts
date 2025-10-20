import { useCallback } from 'react'
import { Result, ok, err } from '@shared/result-util'

interface UseClipboardUtils {
  readLastCopiedText: () => Promise<Result<string, string>>
}

export function useClipboard(): UseClipboardUtils {
  const readLastCopiedText = useCallback(async (): Promise<Result<string, string>> => {
    try {
      const text = await navigator.clipboard.readText()
      return ok(text)
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error)
      return err('Nie udało się odczytać zawartości schowka')
    }
  }, [])

  return {
    readLastCopiedText
  }
}

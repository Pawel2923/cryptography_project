import { useCallback } from 'react'

interface UseClipboardUtils {
  readLastCopiedText: () => Promise<string | null>
}

export function useClipboard(): UseClipboardUtils {
  const readLastCopiedText = useCallback(async () => {
    try {
      return await navigator.clipboard.readText()
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error)
      return null
    }
  }, [])

  return {
    readLastCopiedText
  }
}

import { useCallback, useState } from 'react'

interface LogsState {
  logs: string
  fetchLogs: () => Promise<void>
  loading: boolean
  setLoading: (loading: boolean) => void
  copied: boolean
  copyToClipboard: () => Promise<void>
  errorMessage: string | null
  setErrorMessage: (message: string | null) => void
  saveToFile: () => Promise<void>
}

export function useLogs(): LogsState {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [logs, setLogs] = useState<string>('')

  const fetchLogs = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setErrorMessage(null)
      console.log('Fetching logs...')
      const result = await window.api.logs.get()
      console.log('Logs result:', result)
      if (result.ok) {
        console.log('Logs value:', result.value)
        console.log('Logs length:', result.value.length)
        setLogs(result.value)
      } else {
        setErrorMessage(result.error || 'Nie udało się pobrać logów')
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas pobierania logów')
    } finally {
      setLoading(false)
    }
  }, [])

  const copyToClipboard = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(logs)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      setErrorMessage('Nie udało się skopiować do schowka')
    }
  }, [logs, setErrorMessage])

  const saveToFile = useCallback(async (): Promise<void> => {
    try {
      setErrorMessage(null)
      const result = await window.api.logs.exportToFile()
      if (!result.ok) {
        setErrorMessage(result.error || 'Nie udało się zapisać logów do pliku')
      }
    } catch (error) {
      console.error('Error saving logs to file:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas zapisywania logów')
    }
  }, [setErrorMessage])

  return {
    logs,
    fetchLogs,
    loading,
    setLoading,
    copied,
    copyToClipboard,
    errorMessage,
    setErrorMessage,
    saveToFile
  }
}

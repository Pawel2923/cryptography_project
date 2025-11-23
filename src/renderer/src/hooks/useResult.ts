import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'

interface UseResultReturn {
  downloadResult: () => Promise<void>
  previewResult: () => Promise<void>
  clearFile: () => Promise<void>
  errorMessage: string | null
}

export function useResult(): UseResultReturn {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const downloadResult = useCallback(async (): Promise<void> => {
    try {
      setErrorMessage(null)
      const download = await window.api.file.download()
      if (download.ok) {
        console.log('File downloaded successfully')
      } else {
        const message = download.error || 'Nie udało się pobrać pliku'
        console.error('Error downloading file:', message)
        setErrorMessage(message)
      }
    } catch (error) {
      console.error('Error downloading result:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas pobierania pliku')
    }
  }, [])

  const previewResult = useCallback(async (): Promise<void> => {
    try {
      setErrorMessage(null)
      const preview = await window.api.file.preview()
      if (!preview.ok) {
        const message = preview.error || 'Nie udało się wyświetlić podglądu pliku'
        console.error('Error previewing file:', message)
        setErrorMessage(message)
      } else {
        console.log('File previewed successfully')
      }
    } catch (error) {
      console.error('Error previewing result:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas wyświetlania podglądu')
    }
  }, [])

  const clearFile = useCallback(async (): Promise<void> => {
    try {
      setErrorMessage(null)
      await window.api.file.clear()
      console.log('File cleared successfully')

      await window.api.logs.clear()
      console.log('Logs cleared successfully')

      navigate('/')
    } catch (error) {
      console.error('Error clearing file:', error)
      setErrorMessage('Wystąpił nieoczekiwany błąd podczas czyszczenia pliku')
    }
  }, [navigate])

  return {
    downloadResult,
    previewResult,
    clearFile,
    errorMessage
  }
}

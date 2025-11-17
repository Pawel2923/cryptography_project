export interface CipherProps {
  description: string | undefined
  operation: 'encrypt' | 'decrypt'
  setKey: (key: string) => void
  setIsValid: (isValid: boolean) => void
}

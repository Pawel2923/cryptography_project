export interface CipherProps {
  description: string | undefined
  setKey: (key: string) => void
  setIsValid: (isValid: boolean) => void
}

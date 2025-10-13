import { Button } from '@renderer/components/ui/button'
import { useNavigate } from 'react-router'

export default function AlgorithmsPage({
  operation
}: {
  operation: 'encrypt' | 'decrypt'
}): React.ReactNode {
  const navigate = useNavigate()

  const runAlgorithm = async (): Promise<void> => {
    try {
      const result = await window.api.file.process(operation, { key: '3' })
      if (result.success) {
        console.log('Algorithm result:', result.filePath)
        navigate(`/result`)
      } else {
        console.error('Error processing file:', result.error)
        await window.api.file.clear()
      }
    } catch (error) {
      console.error('Error running algorithm:', error)
      await window.api.file.clear()
    }
  }

  return (
    <div>
      <h1>Wybierz algorytm</h1>
      <Button onClick={runAlgorithm}>Szyfr Cezara</Button>
    </div>
  )
}

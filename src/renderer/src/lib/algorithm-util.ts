import algorithms from '@renderer/assets/algorithms.json'
import { iconMap } from '@renderer/lib/icon-map'

type Algorithm = Readonly<{
  id: string
  name: string
  description?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}>

type JsonData = Omit<Algorithm, 'icon'> &
  Readonly<{
    iconName?: string
  }>

const algorithmList: Algorithm[] = (algorithms as JsonData[]).map((algo) => ({
  ...algo,
  icon: algo.iconName ? iconMap[algo.iconName] : undefined
}))

export const getAlgorithm = (id: string): Algorithm | undefined => {
  return algorithmList.find((algo) => algo.id === id)
}

export const getAlgorithms = (): Algorithm[] => algorithmList

export type { Algorithm }

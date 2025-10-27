import algorithms from '@renderer/assets/algorithms.json'
import AES from '@renderer/components/algorithm/AES'
import CaesarCipher from '@renderer/components/algorithm/CaesarCipher'
import { CipherProps } from '@renderer/components/algorithm/cipher-props'
import RunningKeyCipher from '@renderer/components/algorithm/RunningKeyCipher'
import VigenereCipher from '@renderer/components/algorithm/VigenereCipher'
import { iconMap } from '@renderer/lib/icon-map'
import React from 'react'

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

export const getAlgorithmComponent = (
  id: string,
  props: CipherProps
): React.ReactNode | undefined => {
  switch (id) {
    case 'caesar-cipher':
      return <CaesarCipher {...props} />
    case 'vigenere-cipher':
      return <VigenereCipher {...props} />
    case 'running-key-cipher':
      return <RunningKeyCipher {...props} />
    case 'aes':
      return <AES {...props} />
    default:
      return undefined
  }
}

export type { Algorithm }

import React from 'react'
import Header from '@renderer/components/Header'
import HeaderContent from '@renderer/components/home/HeaderContent'
import Main from '@renderer/components/Main'
import ECDH from '@renderer/components/ECDH'
import { useTitle } from '@renderer/hooks/useTitle'

export default function KeyExchangePage(): React.ReactNode {
  useTitle('Wymiana kluczy (ECDH)')

  return (
    <>
      <Header>
        <HeaderContent />
      </Header>
      <Main>
        <ECDH />
      </Main>
    </>
  )
}

import React from 'react'
import Header from '@renderer/components/Header'
import FileContainer from '@renderer/components/home/FileContainer'
import TextDialog from '@renderer/components/home/TextDialog'
import HeaderContent from '@renderer/components/home/HeaderContent'
import Main from '@renderer/components/Main'

export default function HomePage(): React.ReactNode {
  return (
    <>
      <Header>
        <HeaderContent />
      </Header>
      <Main>
        <FileContainer />
        <TextDialog />
      </Main>
    </>
  )
}

import React from 'react'
import Header from '@renderer/components/Header'
import FileContainer from '@renderer/components/home/FileContainer'
import TextDialog from '@renderer/components/home/TextDialog'

export default function HomePage(): React.ReactNode {
  return (
    <>
      <Header />
      <div className="flex gap-4 justify-center items-center">
        <FileContainer />
        <TextDialog />
      </div>
    </>
  )
}

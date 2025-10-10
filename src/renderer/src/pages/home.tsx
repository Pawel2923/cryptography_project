import React from 'react'
import Header from '@renderer/components/Header'
import FileContainer from '@renderer/components/home/FileContainer'
import TextContainer from '@renderer/components/home/TextContainer'

interface HomePageProps {
  activePage?: 'encrypt' | 'decrypt'
}

export default function HomePage({ activePage }: HomePageProps): React.ReactNode {
  console.log('Active Page:', activePage)

  return (
    <>
      <Header />
      <div className="flex gap-4 justify-center items-center">
        <FileContainer />
        <TextContainer />
      </div>
    </>
  )
}

import React from 'react'
import Header from '@renderer/components/Header'

interface HomePageProps {
  activePage?: 'encrypt' | 'decrypt'
}

export default function HomePage({ activePage }: HomePageProps): React.ReactNode {
  console.log('Active Page:', activePage)

  return (
    <>
      <Header />
    </>
  )
}

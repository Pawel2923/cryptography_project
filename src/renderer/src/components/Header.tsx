import React from 'react'

type HeaderProps = {
  children: React.ReactNode
}

export default function Header({ children }: HeaderProps): React.ReactNode {
  return <header className="flex gap-2 py-6 justify-center items-center w-full">{children}</header>
}

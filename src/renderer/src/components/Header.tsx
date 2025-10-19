import React from 'react'

type HeaderProps = {
  children: React.ReactNode
  className?: string
}

export default function Header({ children, className }: HeaderProps): React.ReactNode {
  return (
    <header className={`flex gap-2 py-6 justify-center items-center w-full ${className}`}>
      {children}
    </header>
  )
}

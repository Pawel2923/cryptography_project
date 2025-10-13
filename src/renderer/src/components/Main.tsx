import React from 'react'

export type MainProps = {
  children: React.ReactNode
  className?: string
  layout?: 'flex' | 'grid'
}

export default function Main({ children, className, layout }: MainProps): React.ReactNode {
  return (
    <div
      className={`gap-4 p-4 justify-center items-center ${className || ''} ${layout === 'grid' ? 'grid justify-items-center' : 'flex'}`}
    >
      {children}
    </div>
  )
}

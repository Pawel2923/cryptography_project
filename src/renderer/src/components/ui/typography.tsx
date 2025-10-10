import React from 'react'

export function TypographyH1({ children }: { children: React.ReactNode }): React.ReactNode {
  return <h1 className="scroll-m-20 text-center text-header-size text-balance">{children}</h1>
}

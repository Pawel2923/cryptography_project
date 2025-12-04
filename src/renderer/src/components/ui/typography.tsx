import React from 'react'

export function TypographyH1({ children }: { children: React.ReactNode }): React.ReactNode {
  return <h1 className="scroll-m-20 text-center text-header-size text-balance">{children}</h1>
}

export function TypographyLabel({ children }: { children: React.ReactNode }): React.ReactNode {
  return <span className="text-label-size">{children}</span>
}

export function TypographyH2({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}): React.ReactNode {
  return (
    <h2 className={`scroll-m-20 pb-2 text-2xl tracking-tight first:mt-0 ${className}`}>
      {children}
    </h2>
  )
}

export function TypographyP({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}): React.ReactNode {
  return <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>{children}</p>
}

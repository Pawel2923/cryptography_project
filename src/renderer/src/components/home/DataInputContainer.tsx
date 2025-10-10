import React from 'react'
import { Link, LinkProps } from 'react-router'

type DataInputContainerProps = LinkProps & {
  children: React.ReactNode
}

export default function DataInputContainer({
  children,
  ...linkProps
}: DataInputContainerProps): React.ReactNode {
  return (
    <Link
      {...linkProps}
      className="flex flex-col justify-center items-center min-h-80 aspect-square p-4 gap-4 text-text-secondary rounded border border-border-primary hover:shadow-hovered hover:text-accent transition"
    >
      {children}
    </Link>
  )
}

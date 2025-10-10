import React from 'react'
import { TypographyH1 } from './ui/typography'
import { NavLink } from 'react-router'

export default function Header(): React.ReactNode {
  const navLinkClasses = 'text-text-disabled hover:text-text-primary-hover transition'

  return (
    <header className="flex gap-2 py-6 justify-center items-center w-full">
      <TypographyH1>
        <NavLink to="/" className={navLinkClasses}>
          Szyfrowanie
        </NavLink>{' '}
        <span className="text-text-subtle">/</span>{' '}
        <NavLink to="/decrypt" className={navLinkClasses}>
          Odszyfrowywanie
        </NavLink>
      </TypographyH1>
    </header>
  )
}

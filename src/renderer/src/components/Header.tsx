import React from 'react'
import { TypographyH1 } from './ui/typography'
import { NavLink } from 'react-router'

export default function Header(): React.ReactNode {
  return (
    <header>
      <TypographyH1>
        <NavLink to="/" className="text-text-disabled hover:text-text-primary-hover">
          Szyfrowanie
        </NavLink>{' '}
        <span className="text-text-subtle">/</span>{' '}
        <NavLink to="/decrypt" className="text-text-disabled hover:text-text-primary-hover">
          Odszyfrowywanie
        </NavLink>
      </TypographyH1>
    </header>
  )
}

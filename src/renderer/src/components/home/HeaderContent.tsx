import React from 'react'
import { NavLink } from 'react-router'
import { TypographyH1 } from '../ui/typography'

export default function HeaderContent(): React.ReactNode {
  const navLinkClasses = 'text-text-disabled hover:text-text-primary-hover transition'

  return (
    <TypographyH1>
      <NavLink to="/encrypt" className={navLinkClasses}>
        Szyfrowanie
      </NavLink>{' '}
      <span className="text-text-subtle">/</span>{' '}
      <NavLink to="/decrypt" className={navLinkClasses}>
        Odszyfrowywanie
      </NavLink>{' '}
      <span className="text-text-subtle">/</span>{' '}
      <NavLink to="/key-exchange" className={navLinkClasses}>
        Wymiana kluczy
      </NavLink>
    </TypographyH1>
  )
}

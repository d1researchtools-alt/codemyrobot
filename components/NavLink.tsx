'use client'

import Link from 'next/link'

export type NavGroup = {
  readonly label: string
  readonly href: string | null
  readonly items: readonly { readonly label: string; readonly href: string }[]
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href) || href.startsWith('mailto:')
}

export function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} onClick={onClick} rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

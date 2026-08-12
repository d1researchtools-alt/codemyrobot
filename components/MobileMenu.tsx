'use client'

import { useState } from 'react'
import { NavLink, type NavGroup } from './NavLink'

export function MobileMenu({ groups }: { groups: readonly NavGroup[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="my-4 flex items-center gap-2 border border-rule px-3 py-2 text-[13px] text-body"
      >
        <span aria-hidden="true" className="flex flex-col gap-[3px]">
          <span className="block h-[2px] w-4 bg-body" />
          <span className="block h-[2px] w-4 bg-body" />
          <span className="block h-[2px] w-4 bg-body" />
        </span>
        Menu
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main menu"
          className="absolute left-0 right-0 top-full max-h-[75vh] overflow-y-auto border-b border-rule bg-white"
        >
          <ul>
            {groups.map((group) => (
              <li key={group.label} className="border-b border-rule">
                {group.href ? (
                  <NavLink
                    href={group.href}
                    className="block px-5 py-3 text-[14px] text-body"
                    onClick={() => setOpen(false)}
                  >
                    {group.label}
                  </NavLink>
                ) : (
                  <span className="block px-5 py-3 text-[14px] text-body">{group.label}</span>
                )}
                {group.items.length > 0 && (
                  <ul className="bg-band">
                    {group.items.map((item) => (
                      <li key={item.label} className="border-t border-rule">
                        <NavLink
                          href={item.href}
                          className="block px-8 py-[10px] text-[13px] text-body"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

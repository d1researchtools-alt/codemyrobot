import Link from 'next/link'
import { MobileMenu } from './MobileMenu'
import { NavLink, type NavGroup } from './NavLink'

export function SiteHeader({ siteTitle, groups }: { siteTitle: string; groups: readonly NavGroup[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-white">
      <div className="relative mx-auto flex max-w-[1100px] items-center justify-between px-5">
        <Link
          href="/"
          className="font-heading text-[22px] leading-none text-body transition-colors hover:text-accent-dark"
        >
          {siteTitle}
        </Link>

        {/* Desktop menu — hover dropdowns, matching the original Avada behaviour. */}
        <nav aria-label="Main menu" className="hidden lg:block">
          <ul className="flex items-stretch">
            {groups.map((group) => (
              <li key={group.label} className="group relative">
                {group.href ? (
                  <NavLink
                    href={group.href}
                    className="flex h-[72px] items-center border-t-[3px] border-transparent px-4 text-[13px] text-body transition-colors group-hover:border-accent group-hover:text-accent-dark"
                  >
                    {group.label}
                  </NavLink>
                ) : (
                  <span className="flex h-[72px] cursor-default items-center border-t-[3px] border-transparent px-4 text-[13px] text-body group-hover:border-accent group-hover:text-accent-dark">
                    {group.label}
                  </span>
                )}

                {group.items.length > 0 && (
                  <ul className="invisible absolute left-0 top-full w-[230px] border border-rule bg-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
                    {group.items.map((item) => (
                      <li key={item.label} className="border-b border-rule last:border-b-0">
                        <NavLink
                          href={item.href}
                          className="block px-4 py-[10px] text-[13px] text-body transition-colors hover:bg-band hover:text-accent-dark"
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

        <MobileMenu groups={groups} />
      </div>
    </header>
  )
}

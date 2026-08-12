import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { getNavigation, getSettings } from '@/lib/reader'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [nav, settings] = await Promise.all([getNavigation(), getSettings()])

  const siteTitle = settings?.siteTitle ?? 'CodeMyRobot.ca'
  const groups = (nav?.groups ?? []).map((group) => ({
    label: group.label,
    href: group.href || null,
    items: group.items ?? [],
  }))

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader siteTitle={siteTitle} groups={groups} />
      <div className="flex-1">{children}</div>
      <SiteFooter
        siteTitle={siteTitle}
        footerText={settings?.footerText ?? null}
        contactEmail={settings?.contactEmail ?? null}
      />
    </div>
  )
}

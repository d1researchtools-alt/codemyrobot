export function SiteFooter({
  siteTitle,
  footerText,
  contactEmail,
}: {
  siteTitle: string
  footerText: string | null
  contactEmail: string | null
}) {
  return (
    <footer className="mt-16 border-t border-rule bg-band">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-2 px-5 py-8 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{footerText || `© ${siteTitle}`}</p>
        {contactEmail && (
          <p>
            <a href={`mailto:${contactEmail}`} className="text-accent hover:text-accent-dark">
              {contactEmail}
            </a>
          </p>
        )}
      </div>
    </footer>
  )
}

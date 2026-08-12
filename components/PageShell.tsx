/** Avada rendered pages as a grey title band followed by the body column. */
export function PageShell({
  title,
  byline,
  children,
}: {
  title: string
  byline?: string | null
  children: React.ReactNode
}) {
  return (
    <>
      <div className="border-b border-rule bg-band">
        <div className="mx-auto max-w-[1100px] px-5 py-9">
          <h1 className="text-[34px]">{title}</h1>
        </div>
      </div>
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        {byline && <p className="mb-6 text-[13px] text-muted">{byline}</p>}
        {children}
      </main>
    </>
  )
}

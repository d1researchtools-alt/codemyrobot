import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ImageCarousel } from '@/components/ImageCarousel'
import { PageBody } from '@/components/PageBody'
import { PageShell } from '@/components/PageShell'
import { RegistrationForm } from '@/components/RegistrationForm'
import { getPage, listPublishedPages } from '@/lib/reader'

type Props = { params: Promise<{ slug: string[] }> }

// Prerender every published page at build time. 'home' is served by app/(site)/page.tsx.
export async function generateStaticParams() {
  const pages = await listPublishedPages()
  return pages.filter((p) => p.slug !== 'home').map((p) => ({ slug: [p.slug] }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug.join('/'))
  if (!page) return {}
  return {
    title: page.title,
    description: page.seoDescription || undefined,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug.join('/'))
  if (!page) notFound()

  const { node } = await page.body()

  return (
    <PageShell title={page.title} byline={page.byline}>
      <PageBody node={node} />
      <ImageCarousel items={page.carousel} />
      {page.showRegistrationForm && (
        <div className="mt-8">
          <RegistrationForm />
        </div>
      )}
    </PageShell>
  )
}

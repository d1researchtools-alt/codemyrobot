import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ImageCarousel } from '@/components/ImageCarousel'
import { PageBody } from '@/components/PageBody'
import { PageShell } from '@/components/PageShell'
import { getPage } from '@/lib/reader'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home')
  return {
    title: { absolute: 'CodeMyRobot.ca' },
    description: page?.seoDescription || undefined,
  }
}

export default async function HomePage() {
  const page = await getPage('home')
  if (!page) notFound()

  const { node } = await page.body()

  return (
    <PageShell title={page.title} byline={page.byline}>
      <PageBody node={node} />
      <ImageCarousel items={page.carousel} />
    </PageShell>
  )
}

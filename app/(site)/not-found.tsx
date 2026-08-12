import Link from 'next/link'
import { PageShell } from '@/components/PageShell'

export default function NotFound() {
  return (
    <PageShell title="Page not found">
      <div className="post-content">
        <p>Sorry, that page doesn&apos;t exist.</p>
        <p>
          <Link href="/">Return to the home page</Link>
        </p>
      </div>
    </PageShell>
  )
}

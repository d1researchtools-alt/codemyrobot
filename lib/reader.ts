import { createReader } from '@keystatic/core/reader'
import keystaticConfig from '../keystatic.config'

/**
 * Reads content straight off the filesystem at build time. In GitHub storage
 * mode the editor commits to the repo, Vercel rebuilds, and this reads the
 * freshly committed files — so the same code path serves both modes.
 */
export const reader = createReader(process.cwd(), keystaticConfig)

export type PageEntry = Awaited<ReturnType<typeof reader.collections.pages.read>>

/** Every page that should appear on the live site. */
export async function listPublishedPages() {
  const slugs = await reader.collections.pages.list()
  const entries = await Promise.all(
    slugs.map(async (slug) => ({ slug, entry: await reader.collections.pages.read(slug) }))
  )
  return entries.filter((p): p is { slug: string; entry: NonNullable<typeof p.entry> } => {
    return p.entry !== null && !p.entry.draft
  })
}

export async function getPage(slug: string) {
  const entry = await reader.collections.pages.read(slug)
  if (!entry || entry.draft) return null
  return entry
}

export async function getNavigation() {
  return reader.singletons.navigation.read()
}

export async function getSettings() {
  return reader.singletons.settings.read()
}

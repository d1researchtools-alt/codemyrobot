/**
 * Checks that every image path in content/ is one Keystatic can read back.
 *
 * Keystatic stores an image as `<publicPath>/<entry slug>/<filename>` and, when
 * loading the entry, recovers the filename by slicing that prefix off the front
 * by LENGTH rather than matching it. A path that is not nested under the page's
 * slug therefore gets cut in the wrong place: on the `info` page a flat
 * `/images/pages/6.1-info.png` becomes `nfo.png`, matches no file on disk, and
 * Keystatic rewrites the image into the page as literal text — so opening and
 * saving that page in the editor destroys the image.
 *
 * Run after hand-editing content: `npm run check:images`
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Mirrors keystatic.config.ts. Keep in sync if publicPath there changes.
const PUBLIC_PATH = '/images/pages/'
const PAGES_DIR = 'content/pages'

/** The exact prefix Keystatic slices off, from its getSrcPrefix(). */
const srcPrefix = (slug) => `${PUBLIC_PATH.replace(/\/*$/, '')}/${slug}/`

const problems = []
let checked = 0

for (const slug of readdirSync(PAGES_DIR)) {
  const file = join(PAGES_DIR, slug, 'index.mdoc')
  if (!existsSync(file)) continue

  const source = readFileSync(file, 'utf8')
  const prefix = srcPrefix(slug)

  const refs = [
    // Markdown images in the body: ![alt](/images/...)
    ...[...source.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]),
    // Carousel entries in the frontmatter: - image: /images/...
    ...[...source.matchAll(/^\s*-?\s*image:\s*(\S+)\s*$/gm)].map((m) => m[1]),
  ].filter((ref) => ref.startsWith('/images/'))

  for (const ref of refs) {
    checked++
    if (!ref.startsWith(prefix)) {
      problems.push(
        `${file}\n    ${ref}\n    is not under ${prefix} — Keystatic would read it as ` +
          `"${ref.slice(prefix.length)}" and corrupt it.`
      )
    } else if (!existsSync(join('public', ref))) {
      problems.push(`${file}\n    ${ref}\n    has no file at public${ref}`)
    }
  }
}

if (problems.length > 0) {
  console.error(`\nBroken image paths (${problems.length}):\n`)
  for (const p of problems) console.error(`  ${p}\n`)
  process.exit(1)
}

console.log(`All ${checked} image paths are nested under their page slug and present on disk.`)

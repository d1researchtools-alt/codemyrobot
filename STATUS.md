# Build status — codemyrobot.ca rebuild

Written 2026-08-12. Snapshot of where the work stands, what's verified, and what's unresolved.

## Where things stand

**The site is complete and building.** `next build` passes, 27 routes, nothing broken.

| Thing | State |
| --- | --- |
| Next.js 15 + TypeScript + Tailwind v4 scaffold | Done |
| Keystatic CMS wired up (`/keystatic`) | Done, local storage mode |
| All 23 pages ported from the Wayback Machine | Done, verified |
| 9 images + 9 downloadable assets (PDFs, game zip) | Done, all serve 200 |
| Nav, footer, mobile menu, Avada palette/fonts | Done |
| Registration form + email endpoint | Done, needs API key to go live |
| Home page image carousel | Done |
| README with deploy + GitHub-mode instructions | Done |
| Keystatic image path format | Settled from source; two corrupt body images fixed |

**Nothing is committed yet.** All work sits in the working tree.

Re-verified on 2026-08-12 after the image fix: `next build` passes with 27 routes, all 23 pages
and 37 internal links return 200, and every file under `public/` serves 200.

## How the port was verified

Rather than eyeball it, I diffed the rendered HTML against the archived pages word-for-word.
20 of 21 comparable pages match exactly. That check caught four real bugs my first conversion
pass shipped:

1. Images with empty alt text were being destroyed by an empty-link cleanup rule, leaving `!`.
2. `<strong>&nbsp;</strong>` was deleted along with its space, welding "IDE that" → "IDEthat".
3. `<strong>` spanning a `<br><br>` left unbalanced `**` rendering as literal asterisks.
4. The bold-balancer wrapped headings in `**`, so `## What is the cost` stopped being a heading.

The one remaining diff is Downloads: `“ Just` vs `“Just`. That is a stray space after an
opening quote in the original — a typo that whitespace normalization absorbed. Not worth fixing.

## The thing that took the time

**Keystatic's image path format.** This is the one place I burned a lot of effort, and it is
worth explaining because it is a real risk, not a yak shave.

Keystatic's `fields.image` has a `publicPath` option. The question was what the editor actually
writes into the YAML when the client uploads an image:

- `/images/pages/photo.jpg` (flat), or
- `/images/pages/home/photo.jpg` (nested under the entry's slug)

This matters because I hand-wrote those paths when porting. If I picked the format the editor
does not expect, then the first time the client opens the home page in the CMS, Keystatic
slices the wrong prefix off the string, the image reference corrupts, and saving the page
breaks the carousel.

It is not documented clearly, and I could not test it headlessly — verifying it properly means
clicking through the editor UI. So I read Keystatic's compiled source, which shows the asset
path built as `<directory>/<slug>/<filename>` when an entry slug is present.

**I went with the nested layout**, because it is strictly safer rather than a coin flip:

- If Keystatic passes the slug (what the source indicates), nested is correct.
- If it does not, nested still resolves to the right file on disk — the only oddity is a
  filename field containing a slash.
- Flat would have been silently corrupting in the first case.

I also wasted about two minutes on a regex that backtracked and hung while grepping a minified
bundle. That one was just a mistake.

### Resolved — and it had already broken two pages

This is now settled from the source, and no editor click-through is needed. Three functions
in `@keystatic/core` 0.5.51 decide it, and they agree:

- `getSrcPrefix(publicPath, slug)` returns `` `${publicPath}/${slug}/` `` whenever a slug is
  present, so the stored path is nested.
- `getDirectoriesForTreeKey()` appends `/<slug>` to each schema directory, so the editor loads
  files from `public/images/pages/<slug>/`.
- On save, the asset is written to `` `${parent}/${slug.value}/${file.path}` ``.

Read and write agree: **nested was correct.** The carousel was right.

What that reasoning missed is that the *same* rule governs images inside the page body, which I
had left flat. It is the same `getSrcPrefix` call in both cases. And the prefix is removed by
slicing `prefix.length` characters off the front — it is never matched — so a flat path is not
rejected, it is cut in the wrong place:

| Page | Stored | Keystatic reads it as |
| --- | --- | --- |
| `/info` | `/images/pages/6.1-info.png` | `nfo.png` |
| `/game` | `/images/pages/robot-build-animation.gif` | `-build-animation.gif` |
| `/` (carousel) | `/images/pages/home/teacher2.jpg` | `teacher2.jpg` ✅ |

Neither corrupted filename matches a file, so Keystatic drops the image node and re-renders it
into the document as literal text. The client opening `/info` in the editor and pressing save
would have written that literal text back and destroyed the image permanently — exactly the
failure this whole investigation was meant to prevent, one field over from where I was looking.

**Fixed.** Both images moved into their slug directories and the two references updated:

```
public/images/pages/info/6.1-info.png            ![](/images/pages/info/6.1-info.png)
public/images/pages/game/robot-build-animation.gif   ![](/images/pages/game/robot-build-animation.gif)
```

`npm run check:images` (added in `scripts/check-images.mjs`) now enforces the rule across all
23 pages. It was confirmed to fail on the original flat paths and pass on the fixed ones, so it
is a real guard and not a rubber stamp.

## Other open items

1. **`/about` is a November 2019 snapshot.** Every other page is July–August 2025. That is the
   most recent capture that exists — the page stopped being crawled. Content may be stale.
2. **The registration form needs three env vars** (`RESEND_API_KEY`, `REGISTRATION_TO_EMAIL`,
   `REGISTRATION_FROM_EMAIL`) before it can send. Until then it shows a clear "not set up yet,
   email us instead" message rather than silently dropping submissions.
3. **Does the client control the codemyrobot.ca domain?** Needed before DNS.
4. **Is the student video/code upload feature coming back?** The rules page references it. That
   is auth + file storage, which no free tier handles gracefully, and it would change the
   hosting picture.

Items 1–4 need the client, not code. The stale dev server on port 3118 has been stopped.

## Deviations from a strict 1:1 copy

- Home carousel is a CSS scroll-snap component, not the original jQuery/Fusion carousel. Same
  layout (4 across, autoplay, lift-on-hover), better accessibility.
- The registration form was Gravity Forms; it is now a React form posting to `/api/registration`.
- Empty `<p>&nbsp;</p>` spacer paragraphs from the WordPress editor were dropped.
- URLs deliberately keep the old WordPress slugs (`/shipping` for Schools, `/contact-2`,
  `/free-2`) so existing links and search results keep working.

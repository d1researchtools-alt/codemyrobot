# codemyrobot

Rebuild of codemyrobot.ca — originally WordPress 5.8.11 with the Avada theme — as a
statically generated Next.js site with a git-based CMS.

- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **CMS:** [Keystatic](https://keystatic.com) — content is markdoc/YAML committed to this repo
- **Host:** Vercel (Hobby tier)

## Running locally

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Editor: http://localhost:3000/keystatic

In development Keystatic runs in **local** storage mode: saving writes straight to
`content/` on disk. No login, no GitHub App.

## How content works

| Path | What it is |
| --- | --- |
| `content/pages/<slug>/index.mdoc` | One page. The directory name is the URL, so `content/pages/rules/` serves `/rules`. |
| `content/pages/home/index.mdoc` | The front page, served at `/`. |
| `content/navigation.yaml` | The main menu — groups and their dropdown items. |
| `content/settings.yaml` | Site title, contact email, footer text. |
| `public/images/pages/<slug>/` | Every image belonging to that page — both carousel images and images used inside the page text. Keystatic files an entry's uploads under its slug, so `/info`'s images live in `public/images/pages/info/`. |
| `public/downloads/` | PDFs and the game zip linked from Downloads, Info, Free and Tutorials. |

Adding a page in the editor creates the route automatically — `app/(site)/[...slug]/page.tsx`
prerenders every non-draft entry. Ticking **Draft** hides a page from the live site.

Slugs deliberately match the old WordPress URLs (`/shipping` for Schools, `/contact-2`,
`/free-2`) so existing links and search results keep working.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). No build settings to change.
3. Add the domain under **Settings → Domains** and point `codemyrobot.ca` at Vercel.

The Hobby tier is fine here because this is a non-commercial site. Note that Vercel's terms
restrict Hobby to non-commercial use — if the site ever sells anything, carries ads, or
someone is paid to run it, it needs the Pro plan.

## Switching the editor to GitHub mode

Local mode only works on your machine. For the client to edit the live site, Keystatic needs
to commit through the GitHub API.

1. Run the site locally and visit http://localhost:3000/keystatic/setup, which walks through
   creating the GitHub App and prints the four environment variables.
2. Add them to Vercel (**Settings → Environment Variables**) and to a local `.env`:

   ```
   KEYSTATIC_GITHUB_CLIENT_ID=...
   KEYSTATIC_GITHUB_CLIENT_SECRET=...
   KEYSTATIC_SECRET=...
   NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=...
   ```

3. Redeploy. `keystatic.config.ts` switches to GitHub storage as soon as
   `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` is present, so no code change is needed.
4. Give the client's GitHub account write access to this repo.

Publishing then works like this: client edits at `codemyrobot.ca/keystatic` → Keystatic
commits → Vercel rebuilds → live in roughly 30–60 seconds.

## The registration form

`/library-registration` carries the school registration form that was a Gravity Forms embed on
the old site. Any page can show it by ticking **Show the school registration form** in the
editor.

Submissions POST to `/api/registration`, which emails them on via Resend's HTTP API. Until
these three variables are set the form returns a clear "not set up yet" message and tells
people to email instead — it never silently drops a submission:

```
RESEND_API_KEY=...
REGISTRATION_TO_EMAIL=codemyrobot@gmail.com
REGISTRATION_FROM_EMAIL=registrations@codemyrobot.ca
```

Resend's free tier covers this comfortably. Swapping to another provider means editing one
`fetch` call in `app/api/registration/route.ts`. The form has a honeypot field for spam.

## Notes on the port

- Palette and type come from the original Avada stylesheet: accent `#a0ce4e`, hover
  `#54770f`, body `#333`, headings in Antic Slab, body copy in PT Sans.
- All 23 pages are ported from the Wayback Machine. Rendered text was diffed word-for-word
  against the archive: 20 of 21 comparable pages match exactly, the 21st differing only by a
  stray space after an opening quote on Downloads.
- Most snapshots are from July–August 2025. **About is from November 2019** — that is the most
  recent capture that exists, so its content may be stale.
- The home page carousel is reproduced from the original Avada `fusion-image-carousel`: four
  items across on desktop (three on tablet, two on phones), autoplaying every 4s with a
  lift-on-hover. It is built on native CSS scroll snapping, so swiping works without a gesture
  library. Autoplay pauses on hover and on keyboard focus, and is skipped entirely for anyone
  with "reduce motion" set.
- Any page can have a carousel — the **Image carousel** field in the editor takes a list of
  images and renders them below the page text.
- `output: 'export'` is not used: the `/keystatic` UI and the API routes need a Node runtime.
  Every content page is still prerendered as static HTML at build time.

### Image paths must be nested under the page slug

This is the one rule to know before hand-editing `content/`. Keystatic builds an image's stored
path as `<publicPath>/<entry slug>/<filename>` and, when reading an entry back, strips exactly
that prefix off the front of the string to recover the filename. The prefix is removed by
length, not matched — so a path that is not nested under the slug is silently cut in the wrong
place and the image reference is destroyed.

A flat `/images/pages/6.1-info.png` on the `info` page loses its first 19 characters and
becomes `nfo.png`, which matches no file. Keystatic then drops the image and rewrites it into
the page as literal text, so opening and saving that page in the editor corrupts it for good.

The rule applies to carousel images and to images inside the page body alike:

```
public/images/pages/info/6.1-info.png   ->  ![](/images/pages/info/6.1-info.png)
public/images/pages/home/teacher2.jpg   ->  carousel: image: /images/pages/home/teacher2.jpg
```

Images uploaded through the editor land in the right place automatically. To check hand-written
paths after editing content by hand:

```bash
npm run check:images
```

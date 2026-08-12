import { config, fields, collection, singleton } from '@keystatic/core'

// Local storage keeps content on disk for development. Once the GitHub App is
// created (see README), setting NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG flips the
// editor over to committing through the GitHub API instead.
const appSlug = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG

const storage = appSlug
  ? ({
      kind: 'github',
      repo: { owner: 'd1researchtools-alt', name: 'codemyrobot' },
    } as const)
  : ({ kind: 'local' } as const)

const link = fields.object(
  {
    label: fields.text({ label: 'Label', validation: { isRequired: true } }),
    href: fields.text({
      label: 'Link',
      description: 'A path like /rules, or a full https:// URL for external links.',
      validation: { isRequired: true },
    }),
  },
  { label: 'Link' }
)

export default config({
  storage,
  ui: {
    brand: { name: 'CodeMyRobot.ca' },
  },
  collections: {
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'content/pages/*/',
      format: { contentField: 'body' },
      columns: ['title'],
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
            validation: { isRequired: true },
          },
          slug: {
            label: 'URL slug',
            description:
              'The address of the page, e.g. "rules" becomes codemyrobot.ca/rules. Use "home" for the front page.',
          },
        }),
        byline: fields.text({
          label: 'Byline',
          description: 'Optional author name shown under the title.',
        }),
        seoDescription: fields.text({
          label: 'Search engine description',
          description: 'One or two sentences shown in Google results.',
          multiline: true,
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Draft pages are hidden from the live site.',
          defaultValue: false,
        }),
        showRegistrationForm: fields.checkbox({
          label: 'Show the school registration form',
          description: 'Adds the School Name / teacher / email registration form below the page text.',
          defaultValue: false,
        }),
        carousel: fields.array(
          fields.object({
            image: fields.image({
              label: 'Image',
              directory: 'public/images/pages',
              publicPath: '/images/pages/',
              validation: { isRequired: true },
            }),
            alt: fields.text({
              label: 'Alt text',
              description: 'Describes the picture for screen readers. Leave blank if decorative.',
            }),
          }),
          {
            label: 'Image carousel',
            description: 'Shown as a sliding gallery below the page text.',
            itemLabel: (props) => props.fields.alt.value || 'Image',
          }
        ),
        body: fields.markdoc({
          label: 'Body',
          options: {
            image: {
              directory: 'public/images/pages',
              publicPath: '/images/pages/',
            },
          },
        }),
      },
    }),
  },
  singletons: {
    navigation: singleton({
      label: 'Navigation menu',
      path: 'content/navigation',
      format: { data: 'yaml' },
      schema: {
        groups: fields.array(
          fields.object(
            {
              label: fields.text({ label: 'Menu heading', validation: { isRequired: true } }),
              href: fields.text({
                label: 'Heading link',
                description: 'Where the heading itself goes. Leave blank to make it a label only.',
              }),
              items: fields.array(link, {
                label: 'Dropdown items',
                itemLabel: (props) => props.fields.label.value,
              }),
            },
            { label: 'Menu group' }
          ),
          {
            label: 'Menu groups',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
      },
    }),
    settings: singleton({
      label: 'Site settings',
      path: 'content/settings',
      format: { data: 'yaml' },
      schema: {
        siteTitle: fields.text({ label: 'Site title', validation: { isRequired: true } }),
        tagline: fields.text({ label: 'Tagline' }),
        contactEmail: fields.text({ label: 'Contact email' }),
        footerText: fields.text({ label: 'Footer text', multiline: true }),
      },
    }),
  },
})

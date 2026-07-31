import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '@/hooks/revalidate'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Main hero image on the homepage.',
              },
            },
            {
              name: 'headline',
              type: 'text',
              localized: true,
            },
            {
              name: 'subhead',
              type: 'text',
              localized: true,
            },
            {
              name: 'intro',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'ctaLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'ctaHref',
              type: 'text',
              admin: {
                description: 'Optional path or URL. Defaults to the Work page for the current locale.',
              },
            },
          ],
        },
        {
          label: 'Featured work',
          fields: [
            {
              name: 'featuredProjects',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              admin: {
                description:
                  'Optional. If empty, featured projects from the Projects collection are used.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobals],
  },
}

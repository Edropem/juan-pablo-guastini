import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '@/hooks/revalidate'

export const Home: GlobalConfig = {
  slug: 'home',
  access: {
    read: () => true,
  },
  fields: [
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
      name: 'featuredProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: {
        description: 'Optional. If empty, featured projects from the Projects collection are used.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobals],
  },
}

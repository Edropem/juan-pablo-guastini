import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '@/hooks/revalidate'

export const About: GlobalConfig = {
  slug: 'about',
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
      name: 'bio',
      type: 'richText',
      localized: true,
    },
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'credits',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional credits, CV summary, or secondary notes.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateGlobals],
  },
}

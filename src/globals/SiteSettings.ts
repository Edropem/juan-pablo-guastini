import type { GlobalConfig } from 'payload'

import { revalidateGlobals } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Juan Pablo Guastini',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'socialLinks',
      type: 'array',
      labels: {
        singular: 'Social link',
        plural: 'Social links',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'footerLine',
      type: 'text',
      localized: true,
    },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobals],
  },
}

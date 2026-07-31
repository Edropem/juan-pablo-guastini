import type { CollectionConfig } from 'payload'

import {
  revalidateProjectsAfterChange,
  revalidateProjectsAfterDelete,
} from '@/hooks/revalidate'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year', 'featured', 'order', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'year',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'disciplines',
      type: 'array',
      labels: {
        singular: 'Discipline',
        plural: 'Disciplines',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      labels: {
        singular: 'Image',
        plural: 'Gallery',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
    },
    {
      name: 'seo',
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
    afterChange: [revalidateProjectsAfterChange],
    afterDelete: [revalidateProjectsAfterDelete],
  },
}

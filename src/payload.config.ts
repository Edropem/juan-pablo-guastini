import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import type { SharpDependency } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { FormSubmissions } from './collections/FormSubmissions'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { Home } from './globals/Home'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const blobToken = process.env.BLOB_READ_WRITE_TOKEN

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Juan Pablo Guastini',
    },
  },
  collections: [Users, Media, Projects, FormSubmissions],
  globals: [SiteSettings, Home, About],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp: sharp as unknown as SharpDependency,
  localization: {
    locales: [
      {
        code: 'en',
        label: 'English',
      },
      {
        code: 'es',
        label: 'Español',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    prodMigrations: migrations,
  }),
  plugins: blobToken
    ? [
        vercelBlobStorage({
          collections: {
            media: true,
          },
          token: blobToken,
        }),
      ]
    : [],
})

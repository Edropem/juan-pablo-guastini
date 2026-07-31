import type { MetadataRoute } from 'next'

import { locales } from '@/i18n/config'
import { getPayloadClient } from '@/lib/payload'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const staticPaths = ['', '/work', '/about', '/contact']

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      })
    }
  }

  try {
    const payload = await getPayloadClient()
    const projects = await payload.find({
      collection: 'projects',
      limit: 200,
      depth: 0,
      locale: 'en',
    })

    for (const project of projects.docs) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/work/${project.slug}`,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    // DB may be unavailable during build without env; return static routes only.
  }

  return entries
}

import { unstable_cache } from 'next/cache'

import type { Locale } from '@/i18n/config'
import { getPayloadClient } from '@/lib/payload'
import type { About, Home, Project, SiteSetting } from '@/payload-types'

export async function getSiteSettings(locale: Locale): Promise<SiteSetting> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({
        slug: 'site-settings',
        locale,
        depth: 1,
      })
    },
    ['site-settings', locale],
    { tags: ['globals'] },
  )()
}

export async function getHome(locale: Locale): Promise<Home> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({
        slug: 'home',
        locale,
        depth: 2,
      })
    },
    ['home', locale],
    { tags: ['globals', 'projects'] },
  )()
}

export async function getAbout(locale: Locale): Promise<About> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({
        slug: 'about',
        locale,
        depth: 1,
      })
    },
    ['about', locale],
    { tags: ['globals'] },
  )()
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'projects',
        locale,
        depth: 1,
        limit: 100,
        sort: 'order',
      })
      return result.docs
    },
    ['projects', locale],
    { tags: ['projects'] },
  )()
}

export async function getFeaturedProjects(locale: Locale): Promise<Project[]> {
  const home = await getHome(locale)

  if (home.featuredProjects && home.featuredProjects.length > 0) {
    return home.featuredProjects.filter(
      (project): project is Project => typeof project === 'object' && project !== null,
    )
  }

  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'projects',
        locale,
        depth: 1,
        limit: 6,
        sort: 'order',
        where: {
          featured: {
            equals: true,
          },
        },
      })
      return result.docs
    },
    ['featured-projects', locale],
    { tags: ['projects'] },
  )()
}

export async function getProjectBySlug(slug: string, locale: Locale): Promise<Project | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'projects',
        locale,
        depth: 2,
        limit: 1,
        where: {
          slug: {
            equals: slug,
          },
        },
      })
      return result.docs[0] ?? null
    },
    ['project', slug, locale],
    { tags: ['projects'] },
  )()
}

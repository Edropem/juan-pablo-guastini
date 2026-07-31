import type { Media } from '@/payload-types'

export function getMediaUrl(media: Media | number | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

export function getMediaAlt(media: Media | number | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}

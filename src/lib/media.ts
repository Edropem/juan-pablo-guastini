import type { Media } from '@/payload-types'

export function getMediaUrl(media: Media | number | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  // "hero" is a width-capped (1920px), uncropped resize — safe to use as the
  // display source everywhere since it preserves aspect ratio. Falls back to
  // the original for video uploads or if the size wasn't generated.
  return media.sizes?.hero?.url ?? media.url ?? null
}

export function getMediaAlt(media: Media | number | null | undefined, fallback = ''): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}

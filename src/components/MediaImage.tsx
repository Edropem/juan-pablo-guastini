'use client'

import clsx from 'clsx'
import Image from 'next/image'
import { useState } from 'react'

import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { Media } from '@/payload-types'

type Props = {
  media: Media | number | null | undefined
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
}

export function MediaImage({
  media,
  className,
  priority,
  sizes = '(max-width: 768px) 100vw, 80vw',
  fill,
  width,
  height,
}: Props) {
  const [loaded, setLoaded] = useState(false)
  const url = getMediaUrl(media)
  if (!url || typeof media === 'number' || !media) return null

  const alt = getMediaAlt(media)
  const intrinsicWidth = width ?? media.width ?? 1600
  const intrinsicHeight = height ?? media.height ?? 1200
  // Priority images should appear as soon as they're ready — the page's own
  // entrance motion already handles their reveal. Only fade in lazy-loaded
  // images, where it masks real network latency instead of adding to it.
  const imageClassName = clsx(
    className,
    !priority && 'media-image',
    !priority && loaded && 'media-image--loaded',
  )

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        className={imageClassName}
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
      />
    )
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={intrinsicWidth}
      height={intrinsicHeight}
      className={imageClassName}
      sizes={sizes}
      priority={priority}
      onLoad={() => setLoaded(true)}
    />
  )
}

'use client'

import { motion } from 'motion/react'

import { MediaImage } from '@/components/MediaImage'
import type { Project } from '@/payload-types'

type Props = {
  gallery: NonNullable<Project['gallery']>
}

export function ProjectGallery({ gallery }: Props) {
  const items = gallery.filter((item) => item?.image && typeof item.image === 'object')

  if (items.length === 0) return null

  return (
    <div className="project-gallery">
      {items.map((item, index) => (
        <motion.figure
          key={item.id ?? index}
          className="project-gallery__item"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <MediaImage media={item.image} sizes="100vw" />
          {item.caption ? <figcaption>{item.caption}</figcaption> : null}
        </motion.figure>
      ))}
    </div>
  )
}

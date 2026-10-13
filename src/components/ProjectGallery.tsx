'use client'

import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

import { MediaImage } from '@/components/MediaImage'
import type { Project } from '@/payload-types'

type GalleryItem = NonNullable<Project['gallery']>[number]

type Props = {
  gallery: NonNullable<Project['gallery']>
  closeLabel: string
  previousLabel: string
  nextLabel: string
  openGalleryLabel: string
}

const EASE = [0.22, 1, 0.36, 1] as const

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? '18%' : '-18%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? '-18%' : '18%', opacity: 0 }),
}

export function ProjectGallery({
  gallery,
  closeLabel,
  previousLabel,
  nextLabel,
  openGalleryLabel,
}: Props) {
  const items = gallery.filter(
    (item): item is GalleryItem & { image: Exclude<GalleryItem['image'], number> } =>
      Boolean(item?.image) && typeof item.image === 'object',
  )
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [direction, setDirection] = useState(1)
  const activeItem = openIndex !== null ? items[openIndex] : null
  const viewportRef = useRef<HTMLDivElement>(null)

  function goNext() {
    setDirection(1)
    setOpenIndex((current) => (current === null ? current : (current + 1) % items.length))
  }

  function goPrev() {
    setDirection(-1)
    setOpenIndex((current) =>
      current === null ? current : (current - 1 + items.length) % items.length,
    )
  }

  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenIndex(null)
        return
      }
      if (event.key === 'ArrowRight') {
        goNext()
        return
      }
      if (event.key === 'ArrowLeft') {
        goPrev()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, items.length])

  function onDragEnd(_event: unknown, info: PanInfo) {
    const width = viewportRef.current?.offsetWidth || 1
    const threshold = Math.max(48, width * 0.18)
    const flicked = Math.abs(info.velocity.x) > 500

    if (info.offset.x <= -threshold || (flicked && info.velocity.x < 0)) {
      goNext()
      return
    }
    if (info.offset.x >= threshold || (flicked && info.velocity.x > 0)) {
      goPrev()
    }
  }

  if (items.length === 0) return null

  const previewItems = items.slice(0, 3)

  return (
    <>
      <div
        className="project-gallery"
        style={{ '--gallery-cols': previewItems.length } as CSSProperties}
      >
        <div className="project-gallery__thumbs">
          {previewItems.map((item, index) => (
            <figure key={item.id ?? index} className="project-gallery__item">
              <div className="project-gallery__thumb">
                <MediaImage
                  media={item.image}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 280px"
                />
              </div>
            </figure>
          ))}
        </div>
        <button type="button" className="project-gallery__cta" onClick={() => setOpenIndex(0)}>
          <span className="project-gallery__cta-label">{openGalleryLabel}</span>
        </button>
      </div>
      {activeItem
        ? createPortal(
            <div
              className="lightbox"
              role="dialog"
              aria-modal="true"
              onClick={() => setOpenIndex(null)}
            >
              <button type="button" className="lightbox__close" onClick={() => setOpenIndex(null)}>
                {closeLabel}
              </button>
              <div className="lightbox__stage" onClick={(event) => event.stopPropagation()}>
                {items.length > 1 ? (
                  <button
                    type="button"
                    className="lightbox__nav lightbox__nav--prev"
                    aria-label={previousLabel}
                    onClick={goPrev}
                  >
                    <span aria-hidden>←</span>
                  </button>
                ) : null}
                <div className="lightbox__viewport" ref={viewportRef}>
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.figure
                      key={openIndex}
                      className="lightbox__figure"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: EASE }}
                      drag={items.length > 1 ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.65}
                      dragMomentum={false}
                      onDragEnd={onDragEnd}
                    >
                      <div className="lightbox__image">
                        <MediaImage media={activeItem.image} sizes="100vw" />
                      </div>
                      {activeItem.caption ? (
                        <figcaption className="lightbox__caption">{activeItem.caption}</figcaption>
                      ) : null}
                    </motion.figure>
                  </AnimatePresence>
                </div>
                {items.length > 1 ? (
                  <button
                    type="button"
                    className="lightbox__nav lightbox__nav--next"
                    aria-label={nextLabel}
                    onClick={goNext}
                  >
                    <span aria-hidden>→</span>
                  </button>
                ) : null}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

'use client'

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
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
  const activeItem = openIndex !== null ? items[openIndex] : null
  const figureRef = useRef<HTMLElement>(null)
  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    deltaX: 0,
    active: false,
  })

  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenIndex(null)
        return
      }
      if (event.key === 'ArrowRight') {
        setOpenIndex((current) =>
          current === null ? current : (current + 1) % items.length,
        )
        return
      }
      if (event.key === 'ArrowLeft') {
        setOpenIndex((current) =>
          current === null ? current : (current - 1 + items.length) % items.length,
        )
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [openIndex, items.length])

  function resetDragTransform(animate: boolean) {
    const figure = figureRef.current
    if (!figure) return
    figure.style.transition = animate ? 'transform 0.22s ease' : ''
    figure.style.transform = 'translateX(0px)'
  }

  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (items.length < 2 || event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      deltaX: 0,
      active: true,
    }
    const figure = figureRef.current
    if (figure) {
      figure.style.transition = 'none'
      figure.setPointerCapture(event.pointerId)
    }
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) return
    drag.deltaX = event.clientX - drag.startX
    const figure = figureRef.current
    if (figure) figure.style.transform = `translateX(${drag.deltaX}px)`
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== event.pointerId) return
    drag.active = false
    const figure = figureRef.current
    const width = figure?.offsetWidth || 1
    const threshold = Math.max(48, width * 0.18)

    if (drag.deltaX <= -threshold) {
      resetDragTransform(false)
      setOpenIndex((current) =>
        current === null ? current : (current + 1) % items.length,
      )
      return
    }

    if (drag.deltaX >= threshold) {
      resetDragTransform(false)
      setOpenIndex((current) =>
        current === null ? current : (current - 1 + items.length) % items.length,
      )
      return
    }

    resetDragTransform(true)
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
            <figure
              key={item.id ?? index}
              className="project-gallery__item"
            >
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
        <button
          type="button"
          className="project-gallery__cta"
          onClick={() => setOpenIndex(0)}
        >
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
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === null ? current : (current - 1 + items.length) % items.length,
                      )
                    }
                  >
                    <span aria-hidden>←</span>
                  </button>
                ) : null}
                <figure
                  ref={figureRef}
                  className="lightbox__figure"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                >
                  <div className="lightbox__image">
                    <MediaImage media={activeItem.image} sizes="100vw" />
                  </div>
                  {activeItem.caption ? (
                    <figcaption className="lightbox__caption">{activeItem.caption}</figcaption>
                  ) : null}
                </figure>
                {items.length > 1 ? (
                  <button
                    type="button"
                    className="lightbox__nav lightbox__nav--next"
                    aria-label={nextLabel}
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === null ? current : (current + 1) % items.length,
                      )
                    }
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

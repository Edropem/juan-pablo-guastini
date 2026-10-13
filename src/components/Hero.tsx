'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Link from 'next/link'
import { useRef } from 'react'

import { MediaImage } from '@/components/MediaImage'
import type { Media } from '@/payload-types'

type Props = {
  siteName: string
  eyebrow?: string | null
  subhead?: string | null
  ctaLabel: string
  ctaHref: string
  heroImage: Media | number | null | undefined
}

const EASE = [0.22, 1, 0.36, 1] as const

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const word = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.7, ease: EASE },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export function Hero({ siteName, eyebrow, subhead, ctaLabel, ctaHref, heroImage }: Props) {
  const hasHeroImage = Boolean(heroImage && typeof heroImage === 'object')
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '10%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const words = siteName.split(' ')

  return (
    <section
      ref={sectionRef}
      className={hasHeroImage ? 'hero hero--with-image' : 'hero'}
    >
      <motion.div
        className="hero__copy"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {eyebrow ? (
          <motion.p className="hero__eyebrow" variants={fadeUp}>
            <span className="hero__eyebrow-dot" aria-hidden />
            {eyebrow}
          </motion.p>
        ) : null}
        <h1 className="hero__brand">
          {words.map((w, index) => (
            <span className="hero__brand-word" key={index}>
              <motion.span className="hero__brand-word-inner" variants={word}>
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        {subhead ? (
          <motion.p className="hero__subhead" variants={fadeUp}>
            {subhead}
          </motion.p>
        ) : null}
        <motion.div variants={fadeUp}>
          <Link href={ctaHref} className="hero__cta">
            {ctaLabel}
          </Link>
        </motion.div>
      </motion.div>
      {hasHeroImage ? (
        <div className="hero__media">
          <motion.div
            className="hero__media-entrance"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <motion.div className="hero__media-inner" style={{ y: imageY, scale: imageScale }}>
              <MediaImage
                media={heroImage}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                className="hero__image"
              />
            </motion.div>
          </motion.div>
        </div>
      ) : null}
    </section>
  )
}

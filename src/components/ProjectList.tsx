'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

import { MediaImage } from '@/components/MediaImage'
import type { Locale } from '@/i18n/config'
import type { Project } from '@/payload-types'

type Props = {
  projects: Project[]
  locale: Locale
  emptyLabel: string
}

export function ProjectList({ projects, locale, emptyLabel }: Props) {
  if (projects.length === 0) {
    return <p className="empty-state">{emptyLabel}</p>
  }

  const total = projects.length

  return (
    <ol className="project-list">
      {projects.map((project, index) => {
        const disciplines =
          project.disciplines?.map((item) => item?.label).filter(Boolean).join(', ') || null

        return (
          <motion.li
            key={project.id}
            className="project-list__item"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={`/${locale}/work/${project.slug}`} className="project-list__link">
              <div className="project-list__meta">
                <span className="project-list__index">
                  {index + 1}/{total}
                </span>
                {disciplines ? <span className="project-list__disciplines">{disciplines}</span> : null}
                {project.year ? <span className="project-list__year">{project.year}</span> : null}
              </div>
              <div className="project-list__main">
                <h2 className="project-list__title">{project.title}</h2>
                {project.summary ? <p className="project-list__summary">{project.summary}</p> : null}
              </div>
              {project.cover && typeof project.cover === 'object' ? (
                <div className="project-list__media">
                  <MediaImage media={project.cover} sizes="(max-width: 768px) 100vw, 420px" />
                </div>
              ) : (
                <div className="project-list__media project-list__media--placeholder" aria-hidden />
              )}
            </Link>
          </motion.li>
        )
      })}
    </ol>
  )
}

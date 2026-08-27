'use client'

import { useState } from 'react'

import { ProjectList } from '@/components/ProjectList'
import type { Locale } from '@/i18n/config'
import type { ProjectGroup } from '@/lib/projects'

type Props = {
  groups: ProjectGroup[]
  locale: Locale
  emptyLabel: string
  categoriesLabel: string
}

export function WorkIndex({ groups, locale, emptyLabel, categoriesLabel }: Props) {
  const [activeId, setActiveId] = useState(groups[0]?.id ?? '')
  const activeGroup = groups.find((group) => group.id === activeId) ?? groups[0]

  if (!activeGroup) return null

  return (
    <>
      {groups.length > 1 ? (
        <nav className="work-nav" aria-label={categoriesLabel}>
          {groups.map((group) => {
            const selected = group.id === activeGroup.id

            return (
              <button
                key={group.id}
                type="button"
                className={selected ? 'work-nav__tab active' : 'work-nav__tab'}
                aria-pressed={selected}
                onClick={() => setActiveId(group.id)}
              >
                {group.label}
              </button>
            )
          })}
        </nav>
      ) : null}
      <ProjectList
        key={activeGroup.id}
        projects={activeGroup.projects}
        locale={locale}
        emptyLabel={emptyLabel}
      />
    </>
  )
}

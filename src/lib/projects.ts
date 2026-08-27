import type { Project } from '@/payload-types'

export type ProjectGroup = {
  id: string
  label: string
  projects: Project[]
}

export function groupProjectsByLabel(
  projects: Project[],
  uncategorizedLabel: string,
): ProjectGroup[] {
  const groups = new Map<string, Project[]>()
  const labelOrder: string[] = []
  const uncategorized: Project[] = []
  const usedIds = new Set<string>()

  for (const project of projects) {
    const labels = uniqueLabels(project)

    if (labels.length === 0) {
      uncategorized.push(project)
      continue
    }

    for (const label of labels) {
      const existing = groups.get(label)
      if (existing) {
        existing.push(project)
        continue
      }
      labelOrder.push(label)
      groups.set(label, [project])
    }
  }

  const result = labelOrder.map((label) => ({
    id: uniqueSlug(label, usedIds),
    label,
    projects: groups.get(label) ?? [],
  }))

  if (uncategorized.length > 0 && result.length > 0) {
    result.push({
      id: uniqueSlug(uncategorizedLabel, usedIds),
      label: uncategorizedLabel,
      projects: uncategorized,
    })
  }

  return result
}

function uniqueLabels(project: Project): string[] {
  const labels: string[] = []
  const seen = new Set<string>()

  for (const item of project.disciplines ?? []) {
    const label = item?.label?.trim()
    if (!label || seen.has(label)) continue
    seen.add(label)
    labels.push(label)
  }

  return labels
}

function uniqueSlug(label: string, usedIds: Set<string>): string {
  const base = slugify(label) || 'category'
  let id = base
  let n = 2
  while (usedIds.has(id)) {
    id = `${base}-${n}`
    n += 1
  }
  usedIds.add(id)
  return id
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

function revalidateProjectPaths(slug?: string) {
  revalidateTag('projects', 'max')
  revalidatePath('/en')
  revalidatePath('/es')
  revalidatePath('/en/work')
  revalidatePath('/es/work')

  if (slug) {
    revalidatePath(`/en/work/${slug}`)
    revalidatePath(`/es/work/${slug}`)
  }
}

export const revalidateProjectsAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateProjectPaths(doc?.slug)
  return doc
}

export const revalidateProjectsAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateProjectPaths(doc?.slug)
  return doc
}

export const revalidateGlobals: GlobalAfterChangeHook = ({ doc, global }) => {
  revalidateTag('globals', 'max')
  revalidatePath('/en')
  revalidatePath('/es')

  if (global?.slug === 'about') {
    revalidatePath('/en/about')
    revalidatePath('/es/about')
  }

  if (global?.slug === 'site-settings') {
    revalidatePath('/en/contact')
    revalidatePath('/es/contact')
  }

  return doc
}

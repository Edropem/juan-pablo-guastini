'use server'

import { getPayloadClient } from '@/lib/payload'

export async function submitContactForm(formData: FormData): Promise<{ ok: boolean }> {
  const name = String(formData.get('name') || '').trim()
  const email = String(formData.get('email') || '').trim()
  const message = String(formData.get('message') || '').trim()

  if (!name || !email || !message) {
    return { ok: false }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'form-submissions',
      data: {
        name,
        email,
        message,
      },
    })
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

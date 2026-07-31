'use client'

import { useState, useTransition } from 'react'

import { submitContactForm } from '@/lib/actions/contact'
import type { Dictionary } from '@/i18n/getDictionary'

type Props = {
  dictionary: Dictionary['contact']
}

export function ContactForm({ dictionary }: Props) {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        setStatus('idle')
        startTransition(async () => {
          const result = await submitContactForm(formData)
          setStatus(result.ok ? 'success' : 'error')
          if (result.ok) {
            event.currentTarget.reset()
          }
        })
      }}
    >
      <label>
        <span>{dictionary.name}</span>
        <input name="name" type="text" required autoComplete="name" />
      </label>
      <label>
        <span>{dictionary.email}</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        <span>{dictionary.message}</span>
        <textarea name="message" rows={6} required />
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? dictionary.sending : dictionary.send}
      </button>
      {status === 'success' ? <p className="contact-form__status">{dictionary.success}</p> : null}
      {status === 'error' ? (
        <p className="contact-form__status contact-form__status--error">{dictionary.error}</p>
      ) : null}
    </form>
  )
}

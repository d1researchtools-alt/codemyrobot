'use client'

import { useState } from 'react'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string }

const field =
  'w-full border border-rule bg-white px-3 py-2 text-[14px] text-body outline-none focus:border-accent'

export function RegistrationForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ kind: 'sending' })

    const data = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({ kind: 'error', message: body.error || 'Something went wrong. Please try again.' })
        return
      }
      setStatus({ kind: 'sent' })
    } catch {
      setStatus({ kind: 'error', message: 'Could not reach the server. Please try again.' })
    }
  }

  if (status.kind === 'sent') {
    return (
      <div className="border border-accent bg-band p-5">
        <p className="text-[15px]">
          Thank you — your registration has been sent. We are all volunteers and aim to reply by the
          Wednesday of each week.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="max-w-[560px] space-y-5">
      <div>
        <label htmlFor="schoolName" className="mb-1 block text-[14px]">
          School Name <span className="text-[#c0830b]">*</span>
        </label>
        <input id="schoolName" name="schoolName" type="text" required className={field} />
      </div>

      <div>
        <label htmlFor="teacherName" className="mb-1 block text-[14px]">
          Lead teacher&apos;s name
        </label>
        <input id="teacherName" name="teacherName" type="text" className={field} />
      </div>

      <div>
        <label htmlFor="teacherEmail" className="mb-1 block text-[14px]">
          Teacher&apos;s Email
        </label>
        <input id="teacherEmail" name="teacherEmail" type="email" className={field} />
      </div>

      <div>
        <label htmlFor="additional" className="mb-1 block text-[14px]">
          Additional Information:
        </label>
        <textarea
          id="additional"
          name="additional"
          rows={8}
          placeholder="Please only one teacher from each school, Tell us a little about what you hope to do with this robot?"
          className={field}
        />
      </div>

      {/* Honeypot — real people never see this, bots fill it in. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === 'error' && (
        <p role="alert" className="text-[14px] text-[#9d1111]">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === 'sending'}
        className="bg-accent px-6 py-[10px] text-[14px] text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {status.kind === 'sending' ? 'Sending…' : 'Submit'}
      </button>
    </form>
  )
}

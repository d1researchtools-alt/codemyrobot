import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Receives a library registration and emails it on.
 *
 * Delivery goes through Resend's HTTP API — no SDK, no extra dependency. Set
 * RESEND_API_KEY, REGISTRATION_TO_EMAIL and REGISTRATION_FROM_EMAIL in the
 * Vercel project to turn it on. Swapping in a different provider means changing
 * only the fetch call below.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: a filled `website` means a bot. Accept quietly so it doesn't retry.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const schoolName = str(payload.schoolName)
  const teacherName = str(payload.teacherName)
  const teacherEmail = str(payload.teacherEmail)
  const additional = str(payload.additional)

  if (!schoolName) {
    return NextResponse.json({ error: 'School Name is required.' }, { status: 400 })
  }
  if (teacherEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(teacherEmail)) {
    return NextResponse.json({ error: 'That email address does not look right.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.REGISTRATION_TO_EMAIL
  const from = process.env.REGISTRATION_FROM_EMAIL

  if (!apiKey || !to || !from) {
    console.error('Registration form is not configured: missing RESEND_API_KEY / REGISTRATION_TO_EMAIL / REGISTRATION_FROM_EMAIL')
    return NextResponse.json(
      { error: 'The registration form is not set up yet. Please email codemyrobot@gmail.com instead.' },
      { status: 503 }
    )
  }

  const lines = [
    `School Name: ${schoolName}`,
    `Lead teacher's name: ${teacherName || '(not given)'}`,
    `Teacher's Email: ${teacherEmail || '(not given)'}`,
    '',
    'Additional Information:',
    additional || '(none)',
  ]

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Library registration: ${schoolName}`,
      text: lines.join('\n'),
      ...(teacherEmail ? { reply_to: teacherEmail } : {}),
    }),
  })

  if (!res.ok) {
    console.error('Resend rejected the registration email', res.status, await res.text())
    return NextResponse.json(
      { error: 'We could not send your registration. Please email codemyrobot@gmail.com instead.' },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}

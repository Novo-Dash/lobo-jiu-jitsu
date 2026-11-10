import type { BookingIntent, Who } from '../types'

export type Form = {
  who: Who | null
  age: string
  experience: 'new' | 'some' | null
  goal: string
  name: string
  phone: string
  email: string
  company: string // honeypot: real people never see it
}

const digits = (s: string) => s.replace(/\D/g, '')

/** (331) 229-9993 while typing. */
export function formatPhone(raw: string) {
  const d = digits(raw), ten = (d.length === 11 && d.startsWith('1') ? d.slice(1) : d).slice(0, 10)
  if (ten.length < 4) return ten
  if (ten.length < 7) return `(${ten.slice(0, 3)}) ${ten.slice(3)}`
  return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())
export const isPhone = (s: string) => { const d = digits(s); return d.length === 10 || (d.length === 11 && d.startsWith('1')) }

/** PRD 11: {name, phone, email, who, age, experience, goal, program, day, time, source, utm_*, page_url}. */
export function buildPayload(f: Form, intent: BookingIntent | null, utms: Record<string, string>, event_id: string) {
  const [first = '', ...rest] = f.name.trim().split(/\s+/)
  const d = digits(f.phone)
  return {
    name: f.name.trim(), firstName: first, lastName: rest.join(' '),
    phone: f.phone.trim(), phoneE164: `+1${d.length === 11 ? d.slice(1) : d}`,
    email: f.email.trim(),
    who: f.who, age: f.who === 'adult' ? '' : f.age.trim(), experience: f.experience, goal: f.goal.trim(),
    program: intent?.program ?? '', day: intent?.day ?? '', time: intent?.time ?? '',
    source: intent?.source ?? 'page',
    ...utms,
    page_url: location.href,
    event_id,
    company: f.company,
    submittedAt: new Date().toISOString(),
  }
}

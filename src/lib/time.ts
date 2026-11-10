import type { Day } from '../types'
import { SITE } from '../data/site'

const ORDER: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Now in Aurora (America/Chicago): weekday, minutes after midnight, and the date of each weekday this week. */
export function auroraNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: SITE.timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now)
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  const day = g('weekday') as Day
  const minutes = +g('hour') * 60 + +g('minute')
  const local = new Date(+g('year'), +g('month') - 1, +g('day'))
  return { day, minutes, hhmm: `${g('hour').padStart(2, '0')}:${g('minute')}`, local }
}

/** "Nov 12" for a weekday of the current week (Mon–Sun), counted from today in Aurora. */
export function dateOf(d: Day, today: Day, local: Date) {
  const week: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const x = new Date(local)
  x.setDate(local.getDate() + ((week.indexOf(d) - week.indexOf(today) + 7) % 7))
  return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const nextDays = (today: Day) => Array.from({ length: 8 }, (_, k) => ORDER[(ORDER.indexOf(today) + k) % 7])

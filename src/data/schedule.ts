import type { Day, Kind, Title, Who } from '../types'

/**
 * The week, in Aurora time. ONE source: the wall board, the phone list, the footer's "next class",
 * the booking prefill and the JSON-LD opening hours all read it.
 */
export type ClassSlot = {
  program: 'Little Lobos' | 'Kids' | 'Juniors' | 'Adults'
  kind: Kind
  who: Who
  days: Day[]
  start: number // minutes after midnight
  end: number | null // null = not confirmed
  gi: 'Gi' | 'No Gi' // the tag next to the name
  sub: string // the second line in the board
}

const t = (h: number, m = 0) => h * 60 + m

// The client's class schedule art (Jonathan, 18/11/2026): every class with its Gi / No Gi and level.
export const CLASSES: ClassSlot[] = [
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Wed'], start: t(7), end: t(8), gi: 'Gi', sub: 'Fundamentals, until\u00a08:00' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Fri'], start: t(7), end: t(8), gi: 'No Gi', sub: 'All levels, until\u00a08:00' },
  { program: 'Kids', kind: 'kids', who: 'child', days: ['Sat'], start: t(10), end: t(10, 50), gi: 'No Gi', sub: 'All ages, until\u00a010:50' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Sat'], start: t(11), end: t(12, 30), gi: 'Gi', sub: 'All levels, until\u00a012:30' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Mon', 'Wed'], start: t(12), end: t(13), gi: 'Gi', sub: 'All levels, until\u00a01:00' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Tue'], start: t(12), end: t(13), gi: 'No Gi', sub: 'All levels, until\u00a01:00' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Thu'], start: t(12), end: t(13), gi: 'Gi', sub: 'Fundamentals, until\u00a01:00' },
  { program: 'Little Lobos', kind: 'kids', who: 'child', days: ['Mon', 'Tue', 'Wed', 'Thu'], start: t(16, 40), end: t(17, 30), gi: 'Gi', sub: 'Ages 4–7, until\u00a05:30' },
  { program: 'Little Lobos', kind: 'kids', who: 'child', days: ['Fri'], start: t(16, 40), end: t(17, 30), gi: 'No Gi', sub: 'Ages 4–7, until\u00a05:30' },
  { program: 'Kids', kind: 'kids', who: 'child', days: ['Mon', 'Tue', 'Wed', 'Thu'], start: t(17, 40), end: t(18, 40), gi: 'Gi', sub: 'Ages 8–11, until\u00a06:40' },
  { program: 'Kids', kind: 'kids', who: 'child', days: ['Fri'], start: t(17, 40), end: t(18, 40), gi: 'No Gi', sub: 'Ages 8–11, until\u00a06:40' },
  { program: 'Juniors', kind: 'kids', who: 'teen', days: ['Mon', 'Tue', 'Wed'], start: t(18, 50), end: t(20), gi: 'Gi', sub: 'Ages 12–15, until\u00a08:00' },
  { program: 'Juniors', kind: 'kids', who: 'teen', days: ['Thu'], start: t(18, 50), end: t(20), gi: 'No Gi', sub: 'Ages 12–15, until\u00a08:00' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Mon'], start: t(18, 50), end: t(20, 10), gi: 'Gi', sub: 'All levels, until\u00a08:10' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Tue', 'Wed'], start: t(18, 50), end: t(20, 10), gi: 'Gi', sub: 'Fundamentals, until\u00a08:10' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Thu'], start: t(18, 50), end: t(20, 10), gi: 'No Gi', sub: 'All levels, until\u00a08:10' },
]

export const DAYS: Day[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const DAY_LONG: Record<Day, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }

export const SCHEDULE = {
  title: { a: 'Class ', b: 'schedule' } satisfies Title,
  note: 'Aurora, Illinois time. Tap any class to book it free.',
  caption: 'Weekly class schedule, Aurora time',
  timeCol: 'Time',
  today: 'Today',
  noClasses: 'No classes',
  noClassesOn: (day: string) => `No classes on ${day}.`,
  book: 'Book',
  filtersLabel: 'Filter classes',
  daysLabel: 'Day of the week',
  filters: [
    { key: 'all', label: 'All classes' },
    { key: 'kids', label: 'Kids & Teens' },
    { key: 'adults', label: 'Adults' },
  ] as const,
  foot: { lead: 'Private lessons', rest: ' by appointment.' },
}

/** "6:50 PM" (board rows, booking) and "6:50 pm" / "7 am" (sentences). */
export const fmtRow = (m: number) => {
  const h = Math.floor(m / 60), mm = m % 60
  return `${h % 12 || 12}:${String(mm).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}
export const fmtShort = (m: number) => {
  const h = Math.floor(m / 60), mm = m % 60
  return `${h % 12 || 12}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${h >= 12 ? 'pm' : 'am'}`
}

/** The board's rows: every start time of the week, in order. */
export const ROWS = [...new Set(CLASSES.map((c) => c.start))].sort((a, b) => a - b)

/** Classes of one day, in order (the phone list and the footer). */
export const classesOn = (d: Day) =>
  CLASSES.filter((c) => c.days.includes(d)).sort((a, b) => a.start - b.start || (a.kind === 'kids' ? -1 : 1))

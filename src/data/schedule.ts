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
  sub: string // the second line in the board
}

const t = (h: number, m = 0) => h * 60 + m

export const CLASSES: ClassSlot[] = [
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Mon', 'Thu'], start: t(7), end: t(8), sub: '7:00–8:00 am' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Sat'], start: t(11), end: t(12, 20), sub: '11:00 am–12:20 pm' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Mon', 'Tue', 'Wed', 'Thu'], start: t(12), end: t(13), sub: '12:00–1:00 pm' },
  // [CONFIRMAR dias do Little Lobos: seg–sex?]
  { program: 'Little Lobos', kind: 'kids', who: 'child', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: t(16, 40), end: t(17, 30), sub: 'Ages 4–7, until 5:30' },
  { program: 'Kids', kind: 'kids', who: 'child', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: t(17, 40), end: t(18, 40), sub: 'Ages 8–11, until 6:40' },
  // [CONFIRMAR término do Juniors]
  { program: 'Juniors', kind: 'kids', who: 'teen', days: ['Mon', 'Tue', 'Wed', 'Thu'], start: t(18, 50), end: null, sub: 'Ages 12–15' },
  { program: 'Adults', kind: 'adults', who: 'adult', days: ['Mon', 'Tue', 'Wed', 'Thu'], start: t(18, 50), end: t(20, 10), sub: '6:50–8:10 pm' },
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

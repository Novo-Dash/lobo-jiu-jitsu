/** Copy with `**bold**` runs, rendered by <Rich>. Keeps every visible word in src/data. */
export type Rich = string

/** A section title: `a` plain, `b` on the yellow highlight (PRD 8.6). Use   between the last two words. */
export type Title = { a: string; b: string }

export type Who = 'child' | 'teen' | 'adult' | 'family'
export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type Kind = 'kids' | 'adults'

export type Img = { src: string; w: number; h: number; sm?: number; alt: string }

/** What a CTA hands the booking: where it was clicked and what it already knows. */
export type BookingIntent = {
  source: string
  who?: Who
  program?: string
  day?: Day
  time?: string
}

import type { Title, Who } from '../types'
import { img } from './img'

export const FINAL = {
  title: { a: 'See the school and meet Fred ', b: 'before you decide anything.' } satisfies Title,
  lead: "Tell us who's training (a child, a teen, yourself or all of you) and we'll match you to the right class.",
  whoLabel: "Who's training?",
  who: [
    { who: 'child', label: 'A child' },
    { who: 'teen', label: 'A teen' },
    { who: 'adult', label: 'Myself' },
    { who: 'family', label: 'All of us' },
  ] satisfies { who: Who; label: string }[],
  photo: img('hero', 'A class at Lobo Jiu-Jitsu: students seated on the mat while Professor Fred demonstrates'),
}

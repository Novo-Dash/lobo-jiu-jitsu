import type { Title } from '../types'
import { img } from './img'

export const FIRST = {
  title: { a: 'Your first class, ', b: 'step by step' } satisfies Title,
  beltLabel: 'Lobo Jiu-Jitsu · Day one',
  // The card alternates with the step: 1 and 3 yellow, 2 and 4 black (PRD 10/08).
  steps: [
    { pill: 'Who', title: "Tell us who's training.", body: "Age, experience and what you're hoping to get from jiu-jitsu.", photo: img('step_who', 'Kids smiling against the wall before class') },
    { pill: 'Match', title: 'We match you to the right class.', body: 'Our team recommends the class and confirms your time.', photo: img('gal_coach', 'Professor Fred watching his students drill') },
    { pill: 'Class', title: 'Come in and take the class.', body: 'Meet Professor Fred, see the space and train. We have trial kimonos, subject to availability and size.', photo: img('step_drill', 'Two students drilling a grip while a black belt watches') },
    { pill: 'Options', title: 'Then we talk options.', body: 'We explain the program and enrollment options, and you decide.', photo: img('gal_group', 'The whole Lobo team, kids and adults, after a promotion') },
  ],
}

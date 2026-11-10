import type { Rich, Title } from '../types'

export const ADULTS = {
  tag: 'Adults',
  title: { a: 'Out of shape, nervous, never trained? ', b: "That's what a normal first day looks like." } satisfies Title,
  lead: 'Adults come to Lobo to learn jiu-jitsu, get fitter, learn self-defense and belong to a group. Men and women, first-timers and experienced students, train here.',
  you: 'You · Seen',
  from: 'Lobo Jiu-Jitsu',
  place: '· Aurora, IL',
  counterLabel: (k: number, n: number) => `Question ${k} of ${n}`,
  // The worry, then the answer; the **bold** run is the key line, black on the yellow balloon.
  exchanges: [
    { q: 'I need to get in shape first.', a: '**Start first.** Fitness follows training, not the other way around.' },
    { q: "I don't know anything. I'll look silly.", a: 'Everyone on this mat had a first day, **Professor Fred included.** Beginner fundamentals are part of the program, and the professor guides you through them.' },
    { q: "I'm worried about the contact, and about getting hurt.", a: "Jiu-jitsu involves physical contact, and we won't promise anyone an injury-free path. What we do offer: step-by-step teaching that starts with the fundamentals, a professor who is on the mat, and a culture built on **respect and care for your training partner.**" },
    { q: 'My schedule is packed.', a: '**11 adult classes a week:** 7:00 am (Mon & Thu), noon (Mon–Thu), 6:50 pm (Mon–Thu) and Saturday at 11:00 am. Two restrooms with showers, so you can train before or after work.' },
  ] satisfies { q: string; a: Rich }[],
}

import type { Who } from '../types'

// Booking: Who's training? → A little about them → Where should we reach you? (PRD 11, 17)
export const BOOKING = {
  dialogTitle: 'Free trial class',
  stepOf: (k: number) => `Step ${k} of 3`,
  doneTop: "You're on the list",
  donePlace: 'Lobo Jiu-Jitsu · Aurora, IL',
  close: 'Close',
  who: {
    title: "Who's training?",
    lead: "Tell us who's coming and we'll match you to the right class.",
    options: {
      child: ['A child', 'Ages 4–11'],
      teen: ['A teen', 'Ages 12–15'],
      adult: ['Myself', '16 and up'],
      family: ['All of us', 'Parent + child or teen'],
    } satisfies Record<Who, [string, string]>,
  },
  about: {
    title: (who: Who | null) => `A little about ${who === 'adult' ? 'you' : who === 'family' ? 'all of you' : 'them'}`,
    fromPage: 'From the page:',
    lead: "Age, experience and what you're hoping to get from jiu-jitsu.",
    age: 'Age',
    ageFamily: "Child's or teen's age",
    agePlaceholder: 'e.g. 7',
    experience: 'Experience',
    exp: { new: ['First time', 'Never trained'], some: ['Trained before', 'Any belt, any gym'] },
    goal: 'What are you hoping to get from it? (optional)',
    goalPlaceholder: 'Focus, fitness, self-defense, competing…',
  },
  contact: {
    title: 'Where should we reach you?',
    lead: 'Our team recommends the class and confirms your time.',
    name: 'Full name',
    phone: 'Phone',
    phonePlaceholder: '(331) 000-0000',
    email: 'Email',
  },
  errors: { name: 'Add your name.', phone: 'Add a 10-digit phone number.', email: 'Add a valid email.', send: "We couldn't send it. Please call (331) 229-9993." },
  next: 'Continue',
  back: 'Back',
  sending: 'Sending…',
  done: {
    title: "We'll match you to the right class.",
    body: 'Our team recommends the class and confirms your time. Questions in the meantime? Call (331) 229-9993.',
    back: 'Back to the page',
  },
  honeypot: 'Leave this field empty',
}

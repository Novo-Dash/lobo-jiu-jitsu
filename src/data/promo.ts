import { img } from './img'

/**
 * Black November (Lobo's own campaign art, Adryan 12/11): sign up in November and the complete uniform
 * is free, rash guard included. It lives in Pricing (the uniform behind the member card, a line on each
 * membership plan), in a bar above the nav and in a line under the final button, and it ends on its
 * own at midnight on December 1 in Aurora (src/lib/promo.ts).
 */
export const PROMO = {
  end: Date.UTC(2026, 11, 1, 6), // 2026-12-01 00:00 America/Chicago (CST, UTC-6)
  name: 'Black November',
  bar: {
    long: 'Enroll by November 30 and the complete uniform is free, rash guard included.',
    short: 'Free uniform when you enroll.', // phones: the name says the month
    link: 'See plans',
  },
  gear: img('bn_uniform', 'The Lobo Jiu-Jitsu gi and rash guard'),
  note: ['The full uniform,', 'free in November.'],
  line: 'Enroll by November 30 and the gi and the rash guard are on us.',
  // [CONFIRMAR com o cliente: vale para todos os planos de mensalidade, inclusive kids? Private lessons fica fora]
  plans: ['Kids Unlimited', 'Adult Unlimited', 'Second adult'] as string[],
  planTag: '+ free uniform',
  final: 'Enroll by November 30: the complete uniform is free, rash guard included.',
}

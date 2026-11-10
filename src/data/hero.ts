import type { Rich, Title } from '../types'
import { img } from './img'

export const HERO = {
  // "and" white, the second half on the yellow band of the page titles (Adryan, 10/11)
  title: { a: 'Brazilian Jiu-Jitsu where the black belt is on the mat, and ', b: 'the whole family has a place.' } satisfies Title,
  sub: 'Lobo Jiu-Jitsu in Aurora, Illinois. Classes for kids from age 4, teens and adults, taught by **Professor Fred Lobo**, a 3rd-degree black belt from Belo Horizonte, Brazil.' satisfies Rich,
  // the team photo (swapped with the final CTA, Adryan 10/11): kids and adults together, the line of the H1
  photo: img('final', 'The Lobo Jiu-Jitsu team, kids and adults, together on the mat in front of the wolf logo'),
}

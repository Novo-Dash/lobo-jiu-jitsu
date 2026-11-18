import type { Rich, Title } from '../types'
import { img } from './img'

export const HERO = {
  // the client's own H1 (Jonathan, 18/11): the second sentence on the yellow band of the page titles
  title: { a: 'Authentic Brazilian Jiu-Jitsu. ', b: 'A place for the whole family.' } satisfies Title,
  sub: 'Train with **Professor Fred Lobo**, a Brazilian 3rd-degree black belt with 25 years of experience. Welcoming kids, teens, and adults in Aurora, IL.' satisfies Rich,
  // the team photo (swapped with the final CTA, Adryan 10/11): kids and adults together, the line of the H1
  photo: img('final', 'The Lobo Jiu-Jitsu team, kids and adults, together on the mat in front of the wolf logo'),
}

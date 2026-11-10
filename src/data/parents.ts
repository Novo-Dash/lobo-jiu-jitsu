import type { Title } from '../types'
import { img } from './img'

export const PARENTS = {
  // the real Lobo backpack (Adryan, 10/11), cut out; decorative next to the notes
  bag: img('bag', 'The Lobo Jiu-Jitsu backpack'),
  // desktop only: the same bag with a white belt lying across, wide enough to sit inside the card
  bagWide: img('bag_wide', 'The Lobo Jiu-Jitsu backpack with a white belt'),
  tag: 'For parents',
  title: { a: "Parents don't come for the technique. ", b: 'They come for what shows up at home and at school.' } satisfies Title,
  lead: 'We use jiu-jitsu to work on focus, independence, getting along with teammates and facing a challenge without giving up. The tools are respect, discipline, perseverance and humility, the same ones we ask of every adult on the mat.',
  // desktop: the titles only, broken where Adryan set them (10/11); the phone keeps the body too
  notesLeft: [
    { title: 'Teens get a class of their own.', lines: ['Teens get a class', 'of their own.'], body: 'Juniors starts at 6:50 pm, Monday to Thursday, the same start time as our adult evening class.' },
    { title: "Your child doesn't have to compete.", lines: ["Your child doesn't", 'have to compete.'], body: 'Competing is for the kids and teens who want it. Everyone else has a full place on the team.' },
  ],
  notesRight: [
    { title: "You're not left waiting in the car.", lines: ["You're not left", 'waiting in the car.'], body: 'A seating area with sofas for parents, a reception desk, restrooms and ample parking.' },
  ],
}

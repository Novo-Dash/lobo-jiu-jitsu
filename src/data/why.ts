import type { Title } from '../types'
import { img } from './img'

export const WHY = {
  title: { a: 'Three reasons families ', b: 'choose Lobo' } satisfies Title,
  panels: [
    {
      n: '01', label: 'The professor himself', title: 'You learn from the professor himself.',
      body: 'A 3rd-degree black belt with 20 years in the sport, who owns the school and teaches the classes, not a name on the door.',
      photo: img('why_prof', 'Professor Fred watching his students drill'),
    },
    {
      n: '02', label: 'Close to its families', title: 'One independent school, close to its families.',
      body: 'Programs by age, from 4 to adult, with room for beginners, families and competitors. The relationship between professor, students and parents is the heart of how we run the school.',
      photo: img('why_family', 'Lobo students of all ages together after a promotion'),
    },
    {
      n: '03', label: 'Fits your routine', title: 'A space that fits your routine.',
      body: "About 4,200 sq ft, with more than 2,200 sq ft of mat, a parents' area, showers and ample parking.",
      photo: img('why_space', 'Kids drilling on the open mat, the Brazilian flag on the wall'),
    },
  ],
}

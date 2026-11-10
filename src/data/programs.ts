import type { Title, Who } from '../types'
import { img } from './img'

export const PROGRAMS = {
  title: { a: "Who's stepping ", b: 'on the mat?' } satisfies Title,
  lead: 'Kids, teens and adults, in classes grouped by age. Tap a class to book it free.',
  // The growth chart: each card's height on the stair (PRD 10/02: 62, 74, 87, 100%).
  classes: [
    { name: 'Little Lobos', mark: '4–7', markUnit: 'years', age: 'Ages 4–7', when: 'Mon–Fri, 4:40–5:30 pm', who: 'child' as Who, photo: img('p_little', 'Little Lobos, ages 4 to 7, sitting together on the mat') }, // [CONFIRMAR dias]
    { name: 'Kids', mark: '8–11', markUnit: 'years', age: 'Ages 8–11', when: 'Mon–Fri, 5:40–6:40 pm', who: 'child' as Who, photo: img('p_kids', 'Two kids from the Kids class smiling in their gis') },
    { name: 'Juniors', mark: '12–15', markUnit: 'years', age: 'Ages 12–15', when: 'Mon–Thu, 6:50 pm', who: 'teen' as Who, photo: img('p_juniors', 'Juniors drilling on the mat while a coach helps') }, // [CONFIRMAR término]
    { name: 'Adults', mark: '16+', markUnit: 'adults', age: 'Ages 16+', when: '7 am, noon, 6:50 pm, Sat 11 am', who: 'adult' as Who, photo: img('p_adults', 'Two adult students training on the blue mat') },
  ],
  tape: ['4 yrs', '8 yrs', '12 yrs', '16 + adult'],
  foot: { lead: 'Private lessons', rest: ' by appointment.', link: 'See the full week' },
}

import type { Title } from '../types'

export const FAQ = {
  title: { a: 'Frequently asked ', b: 'questions' } satisfies Title,
  // 6 of the 12 in the copy; the other 6 are answered in other sections. [CONFIRMAR corte com o gestor]
  items: [
    { q: "I've never trained. Can I really start?", a: 'Yes. Tell us your age, experience and goal when you book. We recommend the right class and confirm the time, and beginners start with the fundamentals.' },
    { q: 'Is it safe for my child?', a: "Jiu-jitsu is a grappling art, with no striking. Classes are grouped by age, and Professor Fred is on the mat. It's still a contact activity, and we won't promise anyone an injury-free path." },
    { q: 'Will my child become aggressive?', a: 'Self-defense is part of what we teach. So are respect, humility and care for your training partner.' },
    { q: 'Will the professor really pay attention to my child, or to me?', a: 'Fred teaches the classes and is on the mat every day. The close relationship between professor, students and families is central to how Lobo works.' },
    { q: 'My child is nervous about trying. What do I do?', a: 'Tell us when you book. The trial class lets your child meet Fred and see the room, and parents have a seating area with sofas.' },
    { q: 'Does my child, or do I, have to compete?', a: 'No. Competing is an invitation, never an expectation. If you want to, we prepare and guide you.' },
  ],
}

import type { Img, Title } from '../types'
import { img } from './img'

export type WalkItem =
  | { kind: 'img'; photo: Img; caption: string; ratio: number }
  | { kind: 'fact'; big: string; text: string; dark?: boolean }

const photo = (name: Parameters<typeof img>[0], caption: string, ratio: number, alt = caption): WalkItem =>
  ({ kind: 'img', photo: img(name, alt), caption, ratio })

export const WALK = {
  title: { a: "What you'll see ", b: 'when you walk in' } satisfies Title,
  // 13 items, from the back of the room to the camera (PRD 10/07). ratio = shown width / height.
  items: [
    photo('gal_class', 'Class on the mat', 1.5, 'A full class seated on the blue mat, listening to the professors'),
    { kind: 'fact', big: '2,200+', text: 'sq ft of mat, in about 4,200 sq ft total' },
    photo('gal_coach', 'Fred on the mat', 0.75, 'Professor Fred watching his students drill'),
    photo('gal_women', 'Adults program', 1, 'Women from the adults program in their gis'),
    { kind: 'fact', big: 'Sofas', text: 'for parents and spectators, plus a reception desk', dark: true },
    photo('gal_kidsgrp', 'Kids team', 2.28, 'The kids team holding their promotion certificates'),
    photo('gal_kids', 'Kids class', 0.8, 'Professor Fred showing a move to the kids class'),
    { kind: 'fact', big: '2', text: 'restrooms with showers' },
    photo('gal_adults', 'Adult team', 1.9, 'Adult students lined up after a promotion'),
    photo('gal_team', 'Promotion day', 0.8, 'Kids and adults celebrating together on promotion day'),
    { kind: 'fact', big: 'Parking', text: 'ample, in a commercial center with a park nearby', dark: true },
    photo('gal_group', 'The pack', 1.59, 'The whole Lobo team, kids and adults, after a promotion'),
    // [CONFIRMAR wording "wheelchair-accessible" com o cliente]
    { kind: 'fact', big: 'Clean', text: 'a well-kept school, and wheelchair-accessible' },
  ] satisfies WalkItem[],
}

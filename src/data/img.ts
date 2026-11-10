import type { Img } from '../types'
import { IMG as PROTO } from './images.gen'
import { UPLOADS } from './images.uploads.gen'

const IMG = { ...PROTO, ...UPLOADS }

type Name = keyof typeof IMG

/** A photo from public/images with its real pixel size (scripts/images.mjs). */
export const img = (name: Name, alt: string, ext: 'webp' | 'png' = 'webp'): Img => {
  const s = IMG[name] as { w: number; h: number; sm?: number }
  return { src: `/images/${name}.${ext}`, w: s.w, h: s.h, sm: s.sm, alt }
}

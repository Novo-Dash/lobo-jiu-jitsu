import type { Who } from '../types'

/** The kit's two audiences: children and teens train in the kids programs, everyone 16+ in adults. */
export const audienceOf = (who?: Who) => (who === 'adult' ? 'adults' : who === 'child' || who === 'teen' ? 'kids' : undefined)

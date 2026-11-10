import { clsx, type ClassValue } from 'clsx'

// The components use the prototype's own classes, never competing Tailwind utilities, so there is
// nothing for tailwind-merge to resolve: clsx alone (tailwind-merge was ~20 KB of the first-load JS).
export const cn = (...inputs: ClassValue[]) => clsx(inputs)

import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

declare global { interface Window { __lenis?: Lenis | null } }

/** Smooth scroll on the GSAP ticker, so ScrollTrigger and Lenis read the same frame (PRD 14). */
export function startLenis() {
  // The kit's booking form (.nd) scrolls on its own. Lenis is stopped while it is open, and a stopped
  // Lenis cancels every wheel and touchmove it sees: on phones the form could not scroll down to its
  // Continue button (25/11). Gestures inside .nd are left to the browser.
  const lenis = new Lenis({ lerp: 0.1, prevent: (node) => node.classList.contains('nd') })
  window.__lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (t: number) => lenis.raf(t * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null }
}

/** Anchor jumps: through Lenis when it runs, native otherwise. */
export function scrollToTarget(target: string | number | HTMLElement, reduced = false) {
  const l = window.__lenis
  if (l) return l.scrollTo(target, { offset: typeof target === 'number' ? 0 : -10, duration: 1.4 })
  if (typeof target === 'number') return window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

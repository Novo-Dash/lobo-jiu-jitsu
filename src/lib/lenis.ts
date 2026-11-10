import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

declare global { interface Window { __lenis?: Lenis | null } }

/** Smooth scroll on the GSAP ticker, so ScrollTrigger and Lenis read the same frame (PRD 14). */
export function startLenis() {
  const lenis = new Lenis({ lerp: 0.1 })
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

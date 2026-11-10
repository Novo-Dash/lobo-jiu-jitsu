import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// One registration for the whole page (PRD 0.2). Sections animate inside useGSAP, which wraps
// gsap.context() and reverts on unmount.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export { gsap, ScrollTrigger, SplitText, useGSAP }

/**
 * Gesture 1 of 2 (PRD 0.4.1): the lines of a title rise from a mask. autoSplit re-splits on resize
 * and once the fonts land; the mask spans get vertical room so accents are never clipped
 * (.ln-mask in app.css, PRD 0.4.2(2)).
 */
export function lines(el: Element, start = 'top 85%') {
  return SplitText.create(el, {
    type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true,
    // aria-label is only allowed on headings here; on a span or p the lines stay readable as they are
    aria: /^H[1-6]$/.test(el.tagName) ? 'auto' : 'none',
    onSplit: (self) => gsap.fromTo(self.lines, { yPercent: 108 }, {
      yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start, once: true },
    }),
  })
}

/** Gesture 2 of 2: a short rise into place. fromTo, never from (StrictMode re-mount, see memory). */
export function rise(targets: gsap.TweenTarget, trigger: Element, opts: { start?: string; stagger?: number; delay?: number; y?: number } = {}) {
  return gsap.fromTo(targets, { y: opts.y ?? 24, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: opts.stagger ?? 0.1, delay: opts.delay ?? 0,
    scrollTrigger: { trigger, start: opts.start ?? 'top 80%', once: true },
  })
}

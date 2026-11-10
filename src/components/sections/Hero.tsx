import { useRef } from 'react'
import { HERO } from '../../data/hero'
import { gsap, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { TitleText } from '../ui/Highlight'
import { Photo } from '../ui/Photo'
import { Rich } from '../ui/Rich'

/**
 * 01 · "What is this?" The class is the background of the card that holds the text; scrolling,
 * the card opens to the edges (margin and radius → 0), the photo settles 1.12 → 1, the text rises
 * and fades. The entrance runs in CSS from the first paint (app.css), so the H1 and the CTA are
 * never hidden waiting for the bundle.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 } })
      tl.to(root.current, { paddingLeft: 0, paddingRight: 0, paddingBottom: 0, ease: 'none' }, 0)
        .to('.hero__card', { borderRadius: 0, ease: 'none' }, 0)
        .fromTo('.hero__media img', { scale: 1.12, yPercent: 0 }, { scale: 1, yPercent: 6, ease: 'none' }, 0)
        .to('.hero__in', { y: -80, opacity: 0.1, ease: 'none' }, 0)
    })
  }, { scope: root })

  return (
    <section className="hero" id="top" data-nav="dark" aria-labelledby="h1" ref={root}>
      <div className="hero__card">
        <div className="hero__media">
          <Photo photo={HERO.photo} eager sizes="(max-width: 899px) calc(100vw - 20px), calc(100vw - 28px)" />
        </div>
        <div className="hero__in">
          <h1 className="t t-hero" id="h1"><TitleText title={HERO.title} /></h1>
          <p className="hero__sub"><Rich text={HERO.sub} /></p>
          <Cta tone="r" id="heroCta" className="hero__cta" />
        </div>
      </div>
    </section>
  )
}

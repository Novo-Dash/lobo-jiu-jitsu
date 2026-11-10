import { useRef } from 'react'
import { PROFESSOR } from '../../data/professor'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { Photo } from '../ui/Photo'
import { Tag } from '../ui/Tag'
import { WolfMark } from '../ui/WolfMark'

// the logo wolf in a row behind Fred: the centre one, and two more on each side (the outer ones run off the panel)
const WOLVES = [-2, -1, 0, 1, 2]

/**
 * 05 · "Who teaches?" Everything inside one white card: on top, the title with his name on its own line
 * in a yellow box and the black belt with three stripes under it; on the right, two lines and the CTA.
 * Below, a yellow panel with a row of black wolves behind Fred, cut out stepping up out of it (feet in
 * the panel, head above it). Scrolling, the panel rises, the wolf grows, Fred climbs.
 */
export function Professor() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    const r = root.current!
    lines(r.querySelector('.pf__h1')!)
    gsap.fromTo('.pf__box', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, delay: 0.2, ease: 'expo.inOut', scrollTrigger: { trigger: '.pf__top', start: 'top 85%', once: true } })
    gsap.fromTo('.pf__belt em s', { scaleY: 0 }, { scaleY: 1, duration: 0.45, delay: 0.7, ease: 'back.out(2)', stagger: 0.15, scrollTrigger: { trigger: '.pf__top', start: 'top 85%', once: true } })
    // ends as the card settles under the nav, so at rest Fred stands with his head on the title line
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.pf__card', start: 'top 85%', end: 'top 14%', scrub: 0.7 } })
    tl.fromTo('.pf__panel', { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'power2.out' }, 0)
      .fromTo('.pf__wolf', { scale: 0.8, rotation: -6 }, { scale: 1, rotation: 0, ease: 'power2.out', stagger: { each: 0.06, from: 'center' } }, 0)
      .fromTo('.pf__me', { yPercent: 30 }, { yPercent: 0, ease: 'power2.out' }, 0.12)
    rise('.pf__r > *', r, { start: 'top 70%' })
  }, { scope: root })

  return (
    <section className="pf" id="professor" aria-labelledby="pf-h" ref={root}>
      <div className="shell">
        <div className="pf__card">
          <div className="pf__top">
            <div className="pf__l">
              <Tag>{PROFESSOR.tag}</Tag>
              <h2 className="t t-1 pf__h" id="pf-h"><span className="pf__h1">{PROFESSOR.title.a.trim()}</span> <span className="pf__box">{PROFESSOR.title.b}</span></h2>
              <span className="bb pf__belt" role="img" aria-label={PROFESSOR.belt}><i /><em><s /><s /><s /></em><i className="bb__tail" /></span>
            </div>
            <div className="pf__r">
              <p className="pf__body">{PROFESSOR.body.map((l, i) => <span key={i}>{l}{i < PROFESSOR.body.length - 1 ? ' ' : ''}</span>)}</p>
              <Cta tone="r" size="sm" source="professor" />
            </div>
          </div>
          <div className="pf__stage">
            <div className="pf__panel" aria-hidden="true"><div className="pf__wolves">{WOLVES.map((i) => <WolfMark key={i} className="pf__wolf" />)}</div></div>
          </div>
          <div className="pf__me"><Photo photo={PROFESSOR.photo} sizes="(max-width: 899px) 245px, 440px" /></div>
        </div>
      </div>
    </section>
  )
}

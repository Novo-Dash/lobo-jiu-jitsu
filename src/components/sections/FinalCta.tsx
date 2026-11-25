import { useRef } from 'react'
import { FINAL } from '../../data/finalCta'
import { SITE } from '../../data/site'
import { gsap, lines, rise, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { audienceOf } from '../../lib/audience'
import { useBooking } from '../../nd'
import { Cta } from '../ui/Cta'
import { TitleText } from '../ui/Highlight'
import { Icon } from '../ui/Icon'
import { Photo } from '../ui/Photo'

/**
 * 13 · "OK, how do I start?" The team, full screen, the photo drifting slightly; tell us who's
 * training right there: each chip opens the booking already on step 2.
 */
export function FinalCta() {
  const root = useRef<HTMLElement>(null)
  const { open } = useBooking()
  useGSAP(() => {
    if (!motionOK()) return
    lines(root.current!.querySelector('h2')!)
    gsap.fromTo('.fin__bg img', { yPercent: -6, scale: 1.3 }, { yPercent: 4, scale: 1.22, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    rise('.who button, .fin__row', root.current!, { start: 'top 35%', y: 20, stagger: 0.06 })
  }, { scope: root })

  return (
    <section className="fin" id="final" data-nav="dark" aria-labelledby="fin-h" ref={root}>
      <div className="fin__bg" aria-hidden="true"><Photo photo={FINAL.photo} alt="" sizes="100vw" /></div>
      <div className="shell">
        <h2 className="t t-1" id="fin-h"><TitleText title={FINAL.title} /></h2>
        <p className="lead">{FINAL.lead}</p>
        <div className="who" role="group" aria-label={FINAL.whoLabel}>
          {FINAL.who.map((w) => (
            <button key={w.who} type="button" onClick={() => open({ audience: audienceOf(w.who) })}>{w.label}</button>
          ))}
        </div>
        <div className="fin__row">
          <Cta />
          <a className="call" href={SITE.phone.tel}><Icon name="phone" /><u>{SITE.phone.display}</u></a>
        </div>
      </div>
    </section>
  )
}

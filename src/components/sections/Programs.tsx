import { useRef } from 'react'
import { PROGRAMS } from '../../data/programs'
import { gsap, lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { track } from '../../lib/track'
import { useBooking } from '../../booking/BookingContext'
import { TitleText } from '../ui/Highlight'
import { Photo } from '../ui/Photo'
import { SquareArrow } from '../ui/SquareArrow'

/**
 * 02 · "Is there a class for me / my child?" A growth chart: four cards climb in a stair from
 * 4 years old to adult (62, 74, 87, 100% tall) over a yellow tape measure. The tape unrolls,
 * the cards rise in order. Each card is the button that books that class.
 */
export function Programs() {
  const root = useRef<HTMLElement>(null)
  const { open } = useBooking()

  useGSAP(() => {
    if (!motionOK()) return
    lines(root.current!.querySelector('h2')!)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: '.stairs', start: 'top 78%', once: true } })
      tl.fromTo('.tape', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.inOut' })
        .fromTo('.stairs .pc', { yPercent: 100, clipPath: 'inset(100% 0 0 0 round 22px)' }, { yPercent: 0, clipPath: 'inset(0% 0 0 0 round 22px)', duration: 1, ease: 'expo.out', stagger: 0.14 }, '-=.45')
        .fromTo('.stairs .step__mark', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.14 }, '-=1.1')
    })
    mm.add('(max-width: 899px)', () => {
      gsap.fromTo('.stairs .pc', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.stairs', start: 'top 85%', once: true } })
    })
  }, { scope: root })

  return (
    <section className="sec wt fit" id="programs" aria-labelledby="pg-h" ref={root}>
      <div className="shell">
        <div className="head head--row pg__head">
          <h2 className="t t-1" id="pg-h"><TitleText title={PROGRAMS.title} /></h2>
          <p className="lead">{PROGRAMS.lead}</p>
        </div>
        <div className="pg__wrap">
          <ul className="stairs" role="list">
            {PROGRAMS.classes.map((c) => (
              <li className="step" key={c.name}>
                <span className="step__mark"><b>{c.mark}</b>{c.markUnit}</span>
                <button
                  type="button"
                  className="pc"
                  onClick={() => { track.cta('program', { program: c.name }); open({ source: 'program', who: c.who, program: c.name }) }}
                >
                  <Photo photo={c.photo} alt="" sizes="(max-width: 899px) calc(50vw - 26px), 25vw" />
                  <span className="pc__b">
                    <span>
                      <span className="pc__name">{c.name}</span>
                      <span className="pc__meta"><em>{c.age}</em><br />{c.when}</span>
                    </span>
                    <SquareArrow />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="tape" aria-hidden="true">
            <div className="tape__ticks" />
            <div className="tape__nums">{PROGRAMS.tape.map((t) => <span key={t}>{t}</span>)}</div>
          </div>
        </div>
        <div className="pg__foot">
          <span><b>{PROGRAMS.foot.lead}</b>{PROGRAMS.foot.rest}</span>
          <a className="call" href="#schedule"><u>{PROGRAMS.foot.link}</u></a>
        </div>
      </div>
    </section>
  )
}

import { useRef, useState } from 'react'
import { ADULTS } from '../../data/adults'
import { gsap, SplitText, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { Rich } from '../ui/Rich'
import { Tag } from '../ui/Tag'
import { WolfMark } from '../ui/WolfMark'

const N = ADULTS.exchanges.length

/**
 * 04 · "What if I'm out of shape?" The signature scene (Satori's format, Lobo's colours): one worry
 * at a time as a huge black message, "typing" in a yellow bubble, then the school's yellow answer;
 * both fly off and the next worry comes in. On the 4th, the CTA. A sticky stage 3.2 screens tall
 * (PRD 0.13: 0.8 per worry). Reduced motion and phones: the four exchanges as a plain
 * stacked list.
 */
export function Adults() {
  const root = useRef<HTMLElement>(null)
  const [k, setK] = useState(0)
  const [read, setRead] = useState(-1)
  const [live, setLive] = useState(false)

  useGSAP(() => {
    if (!motionOK()) return
    const mm = gsap.matchMedia()
    // desktop: the pinned chat scene
    mm.add('(min-width: 900px)', () => {
      const ex = gsap.utils.toArray<HTMLElement>('.dq__ex', root.current)
      let lastK = 0, lastRead = -1
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top 30%', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
        onUpdate: () => {
          const t = tl.time(), nk = Math.min(N - 1, Math.floor(t))
          let nr = -1
          ex.forEach((_, i) => { if (t > i + 0.3) nr = i })
          if (nk !== lastK) { lastK = nk; setK(nk) }
          if (nr !== lastRead) { lastRead = nr; setRead(nr) }
        },
      })
      ex.forEach((e, i) => {
        const q = e.querySelector('.bq')!, ty = e.querySelector('.typing')!, a = e.querySelector('.ba')!
        const words = SplitText.create(e.querySelector('.bq__t')!, { type: 'words', aria: 'none' }).words
        gsap.set(q, { transformOrigin: '0% 100%' }); gsap.set(a, { transformOrigin: '100% 100%' }); gsap.set([q, ty, a], { opacity: 0 })
        tl.fromTo(q, { opacity: 0, scale: 0.7, y: 60 }, { opacity: 1, scale: 1, y: 0, duration: 0.14, ease: 'back.out(1.6)' }, i)
          .fromTo(words, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.12, stagger: 0.02, ease: 'power3.out' }, i + 0.04)
          .fromTo(ty, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(2)' }, i + 0.2)
          .to(ty, { opacity: 0, scale: 0.6, duration: 0.04 }, i + 0.34)
          .fromTo(a, { opacity: 0, scale: 0.7, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.12, ease: 'back.out(1.6)' }, i + 0.36)
        if (i < N - 1) {
          tl.to(q, { x: '-110vw', rotation: -8, duration: 0.16, ease: 'power2.in' }, i + 0.8)
            .to(a, { x: '110vw', rotation: 6, duration: 0.16, ease: 'power2.in' }, i + 0.82)
        }
      })
      tl.fromTo('.dq__end', { opacity: 0 }, { opacity: 1, duration: 0.1 }, N - 0.38).to({}, { duration: 0.2 }, N - 0.2)
      setLive(true)
      return () => setLive(false)
    })
    // phones (Adryan, 10/11): a plain stacked chat, each worry and its answer slide in as you reach them
    mm.add('(max-width: 899px)', () => {
      gsap.utils.toArray<HTMLElement>('.dq__ex', root.current).forEach((e) => {
        const st = { trigger: e, start: 'top 82%', once: true }
        gsap.fromTo(e.querySelector('.bq'), { x: -36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: st })
        gsap.fromTo(e.querySelector('.ba'), { x: 36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, delay: 0.25, ease: 'power3.out', scrollTrigger: st })
      })
    })
  }, { scope: root })

  return (
    <section className={`dq${live ? ' is-live' : ''}`} id="adults" aria-labelledby="ad-h" ref={root}>
      <div className="dq__stage">
        <div className="shell dq__in">
          <div className="dq__top">
            <div className="dq__l">
              <Tag>{ADULTS.tag}</Tag>
              <h2 className="dq__title" id="ad-h">{ADULTS.title.a}<br /> <span className="y">{ADULTS.title.b}</span></h2>
            </div>
            <div className="dq__r">
              <div className="dq__prog" aria-hidden="true">
                <span className="dq__count"><b>{k + 1}</b> / {N}</span>
                <span className="dq__bars">{ADULTS.exchanges.map((_, i) => <i key={i} className={i === k ? 'on' : i < k ? 'done' : ''} />)}</span>
              </div>
              <p className="dq__lead">{ADULTS.lead}</p>
            </div>
          </div>
          <ol className="dq__chat" role="list">
            {ADULTS.exchanges.map((x, i) => (
              <li className="dq__ex" key={x.q}>
                <div className={`bq${read >= i ? ' is-read' : ''}`}>
                  <p className="bq__t">{x.q}</p>
                  <span className="bq__meta">{ADULTS.you} <i className="ticks2" aria-hidden="true">✓✓</i></span>
                </div>
                <div className="typing" aria-hidden="true"><i /><i /><i /></div>
                <div className="ba">
                  <span className="ba__av" aria-hidden="true"><WolfMark /></span>
                  <span className="ba__from">{ADULTS.from} <b aria-hidden="true">✓</b><i>{ADULTS.place}</i></span>
                  <p><Rich text={x.a} /></p>
                </div>
              </li>
            ))}
          </ol>
          <div className="dq__end"><Cta tone="r" who="adult" /></div>
        </div>
      </div>
    </section>
  )
}

import { useRef, useState } from 'react'
import { PRICING } from '../../data/pricing'
import { PROMO } from '../../data/promo'
import { usePromo } from '../../lib/promo'
import { SITE } from '../../data/site'
import { gsap, lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { Photo } from '../ui/Photo'
import { TitleText } from '../ui/Highlight'
import { Tag } from '../ui/Tag'
import { WolfMark } from '../ui/WolfMark'

type Plan = (typeof PRICING.plans)[number]

function Face({ side, plan }: { side: 'f' | 'b'; plan: Plan }) {
  const logo = side === 'f' ? SITE.logo : SITE.logoBlack
  return (
    <div className={`mcard__${side}`}>
      <WolfMark className="mcard__wolf" />
      <div className="mcard__top"><img src={logo.src} width={logo.w} height={logo.h} alt="" /><span className="chip" /></div>
      <div className="mcard__mid">
        <div className="mcard__plan">{plan.name}</div>
        <div className="mcard__price"><span>{plan.price}</span><small>{plan.perLong}</small></div>
      </div>
      <div className="mcard__bot"><span>{PRICING.cardFoot}</span></div>
    </div>
  )
}

/**
 * 10 · "How much?" Four plan cards 2×2 (the chosen one turns yellow, checks and lifts 4px) and the
 * member card (1.586:1): black front with the big yellow wolf, yellow back with the black logo and
 * the black wolf. Picking a plan turns the card to it; it leans toward the pointer.
 */
export function Pricing() {
  const root = useRef<HTMLElement>(null)
  const tilt = useRef<HTMLDivElement>(null)
  const [sel, setSel] = useState(0)
  const [faces, setFaces] = useState({ f: 0, b: 1, rot: 0 })
  const promo = usePromo()

  useGSAP(() => {
    if (!motionOK()) return
    lines(root.current!.querySelector('h2')!)
    gsap.fromTo(tilt.current, { y: 80, rotationX: 30, opacity: 0 }, { y: 0, rotationX: 0, opacity: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
    // Black November: the uniform comes up out of the card once the card has landed, then the note and its arrow
    if (root.current!.querySelector('.bn-gear')) {
      const tl = gsap.timeline({ delay: 0.5, scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
      tl.fromTo('.bn-gear img', { yPercent: 45 }, { yPercent: 0, duration: 1.1, ease: 'expo.out' }, 0)
        .fromTo('.bn-note', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.35)
        .fromTo('.bn-note path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut', stagger: 0.12 }, 0.55)
    }
    if (!matchMedia('(hover: hover)').matches) return
    const ry = gsap.quickTo(tilt.current, 'rotationY', { duration: 0.8, ease: 'power3.out' })
    const rx = gsap.quickTo(tilt.current, 'rotationX', { duration: 0.8, ease: 'power3.out' })
    const card = root.current!.querySelector('.card3d')!
    const move = (e: PointerEvent) => { const r = card.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 14); rx(((e.clientY - r.top) / r.height - 0.5) * -10) }
    const leave = () => { ry(0); rx(0) }
    root.current!.addEventListener('pointermove', move)
    root.current!.addEventListener('pointerleave', leave)
    return () => { root.current?.removeEventListener('pointermove', move); root.current?.removeEventListener('pointerleave', leave) }
  }, { scope: root })

  const pick = (i: number) => {
    if (i === sel) return
    setSel(i)
    // the hidden face gets the new plan, then the card turns to it
    setFaces((s) => { const showingFront = (s.rot / 180) % 2 === 0; return showingFront ? { ...s, b: i, rot: s.rot + 180 } : { ...s, f: i, rot: s.rot + 180 } })
  }
  const p = PRICING.plans[sel]

  return (
    <section className="sec wt fit" id="pricing" aria-labelledby="pr-h" ref={root}>
      <div className="shell inv__grid">
        <div className="inv__l">
          <Tag>{PRICING.tag}</Tag>
          <h2 className="t t-1 inv__h" id="pr-h"><TitleText title={PRICING.title} /></h2>
          {promo ? <p className="bn-line"><b>{PROMO.name}</b> {PROMO.line}</p> : null}
          <div className="plans" role="group" aria-label={PRICING.plansLabel}>
            {PRICING.plans.map((pl, i) => (
              <button key={pl.name} type="button" className="plan" aria-pressed={i === sel} onClick={() => pick(i)}>
                <i aria-hidden="true" />
                <span className="plan__n"><b>{pl.name}</b><small>{pl.note}</small>{promo && PROMO.plans.includes(pl.name) ? <em className="plan__bn">{PROMO.planTag}</em> : null}</span>
                <span>{pl.price}<small>{pl.per}</small></span>
              </button>
            ))}
          </div>
          <p className="inv__note">{PRICING.note}</p>
          <div className="inv__cta"><Cta tone="r" /></div>
        </div>
        <div className={`inv__r${promo ? ' has-bn' : ''}`}>
          {promo ? (
            <>
              <p className="bn-note">
                {PROMO.note.map((l, i) => <span key={i}>{l}{i < PROMO.note.length - 1 ? ' ' : ''}</span>)}
                <svg viewBox="0 0 110 64" aria-hidden="true" focusable="false">
                  <path d="M6 14 C 40 6, 78 18, 102 46" pathLength={1} />
                  <path d="M86 42 L103 48 L101 30" pathLength={1} />
                </svg>
              </p>
              <div className="bn-gear" aria-hidden="true"><Photo photo={PROMO.gear} alt="" sizes="(max-width: 999px) 72vw, 420px" /></div>
            </>
          ) : null}
          <div className="card3d" role="img" aria-label={`${PRICING.cardFoot}: ${p.name}, ${p.price}${p.perLong}`}>
            <div className="tilt" ref={tilt}>
              <div className="mcard" style={{ transform: `rotateY(${faces.rot}deg)` }}>
                <Face side="f" plan={PRICING.plans[faces.f]} />
                <Face side="b" plan={PRICING.plans[faces.b]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

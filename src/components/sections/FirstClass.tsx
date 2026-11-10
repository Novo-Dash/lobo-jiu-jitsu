import { useRef, useState } from 'react'
import { FIRST } from '../../data/firstClass'
import { gsap, lines, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { TitleText } from '../ui/Highlight'
import { Photo } from '../ui/Photo'

const N = FIRST.steps.length

/**
 * 08 · "How does the free class work?" A big white belt crosses the screen; its black bar earns one
 * stripe per step. Below, the step card: the whole card alternates, 1 and 3 yellow, 2 and 4 black.
 * Pinned 1.8 screens (PRD 0.13), floor(progress × 4) → step. Phones (Adryan, 10/11): no pin; the four
 * steps as four cards in a column, the belt sticky above them, a stripe earned as each card arrives.
 */
export function FirstClass() {
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const prev = useRef(-1)

  useGSAP(() => {
    if (!motionOK()) return
    lines(root.current!.querySelector('h2')!)
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      let last = 0
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: '+=180%', pin: root.current!.querySelector<HTMLElement>('.first__pin')!, anticipatePin: 1,
        onUpdate: (s) => { const k = Math.min(N - 1, Math.floor(s.progress * 4.15)); if (k !== last) { last = k; setStep(k) } },
      })
    })
    mm.add('(max-width: 899px)', () => {
      gsap.utils.toArray<HTMLElement>('.fcm__c', root.current).forEach((c, i) => {
        ScrollTrigger.create({ trigger: c, start: 'top 70%', onEnter: () => setStep(i), onLeaveBack: () => setStep(Math.max(0, i - 1)) })
        gsap.fromTo(c, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%', once: true } })
      })
    })
    gsap.fromTo('.belt', { xPercent: -40, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
  }, { scope: root })

  // the stripes: the one just earned springs in, the ones taken back drop
  useGSAP(() => {
    if (!motionOK()) return
    const tips = gsap.utils.toArray<HTMLElement>('.belt__bar i', root.current)
    tips.forEach((t, i) => gsap.to(t, { scaleY: i <= step ? 1 : 0, duration: i <= step ? 0.55 : 0.3, ease: i <= step ? 'back.out(2.2)' : 'power2.in', delay: i === step && step > prev.current ? 0.05 : 0 }))
    prev.current = step
  }, { scope: root, dependencies: [step] })

  return (
    <section className="first" id="first" aria-labelledby="fc-h" ref={root}>
      <div className="first__pin">
        <div className="shell first__top">
          <h2 className="t t-1" id="fc-h"><TitleText title={FIRST.title} /></h2>
          <div className="first__cta"><Cta tone="r" /></div>
        </div>
        <div className="belt" aria-hidden="true">
          <div className="belt__cloth" /><div className="belt__stitch" />
          <span className="belt__lbl">{FIRST.beltLabel}</span>
          <div className="belt__bar">{FIRST.steps.map((s) => <i key={s.pill} />)}</div>
        </div>
        <div className="shell">
          <div className="scard" data-c={step % 2 ? 'k' : 'y'}>
            <div className="scard__body">
              <div className="step__n" aria-hidden="true"><span>{step + 1}</span></div>
              <ol className="slist">
                {FIRST.steps.map((s, i) => (
                  <li key={s.pill} className={`si${i === step ? ' on' : ''}`} aria-current={i === step ? 'step' : undefined}>
                    <span className="si__k" aria-hidden="true">{i + 1}</span>
                    <h3 className="t t-2">{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
              <div className="scard__foot">
                <ol className="strack" aria-hidden="true">
                  {FIRST.steps.map((s, i) => <li key={s.pill} className={i === step ? 'on' : i < step ? 'done' : ''}><i>{i + 1}</i>{s.pill}</li>)}
                </ol>
              </div>
            </div>
            <div className="sph" aria-hidden="true">
              {FIRST.steps.map((s, i) => <Photo key={s.pill} photo={s.photo} alt="" className={i === step ? 'on' : undefined} sizes="(max-width: 999px) 0px, 40vw" />)}
            </div>
          </div>
          <ol className="fcm">
            {FIRST.steps.map((s, i) => (
              <li key={s.pill} className="fcm__c" data-c={i % 2 ? 'k' : 'y'}>
                <span className="fcm__n" aria-hidden="true">{i + 1}</span>
                <div><h3 className="t t-2">{s.title}</h3><p>{s.body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

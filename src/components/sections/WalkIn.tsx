import { useRef } from 'react'
import { WALK, type WalkItem } from '../../data/walk'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { TitleText } from '../ui/Highlight'
import { Photo } from '../ui/Photo'

const GAP = 470 // depth between two items (PRD 0.13)
const SCREENS = 2.4 // pinned length (PRD 0.13: was ~4.4 in the prototype)
// x as a share of the width, y as a share of the height: left and right lanes, never the centre line
const LANES = [[-0.26, -0.04], [0.27, 0.1], [-0.3, 0.14], [0.3, -0.1], [-0.18, -0.16], [0.22, 0.16], [-0.32, 0.02], [0.32, 0], [-0.24, 0.14], [0.26, -0.14], [-0.3, -0.08], [0.24, 0.12], [0, 0.04]]

function Item({ it, h }: { it: WalkItem; h: number }) {
  if (it.kind === 'img') {
    return (
      <figure className="wi__in">
        <Photo photo={it.photo} sizes={`${Math.round(h * it.ratio)}px`} style={{ height: h, width: Math.round(h * it.ratio), objectFit: 'cover' }} />
        <figcaption>{it.caption}</figcaption>
      </figure>
    )
  }
  return <div className={`wf${it.dark ? ' wf--k' : ''}`}><b>{it.big}</b><p>{it.text}</p></div>
}

/**
 * 07 · "What is the place like?" You walk into the school: 13 photos and facts come from the back of
 * the room (translate3d, perspective 900px) and pass the camera. The title leaves as the walk starts,
 * a yellow bar measures it, and the last card is gone before the scene ends (PRD 10/07).
 * Phones and reduced motion: a horizontal rail with snap. Only one of the two is displayed at a
 * time (display:none on the other), so nothing real sits under aria-hidden.
 */
export function WalkIn() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!motionOK()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px)', () => {
      const stage = root.current!.querySelector<HTMLElement>('.walk__stage')!
      const items = gsap.utils.toArray<HTMLElement & { _x?: number; _y?: number; _z?: number; _w?: number; _h?: number }>('.wi', stage)
      const bar = stage.querySelector('.walk__bar i'), title = stage.querySelector('.walk__title')
      const place = () => items.forEach((el, i) => {
        const [lx, ly] = LANES[i % LANES.length]
        el._x = lx * innerWidth; el._y = ly * innerHeight + 30; el._z = -i * GAP - 300; el._w = el.offsetWidth; el._h = el.offsetHeight
      })
      place()
      const total = (items.length - 1) * GAP + 300 + 640
      const render = (cam: number) => items.forEach((el) => {
        const rel = el._z! + cam
        const fadeIn = gsap.utils.clamp(0, 1, (rel + 3000) / 1000), fadeOut = gsap.utils.clamp(0, 1, (620 - rel) / 260)
        el.style.opacity = String(Math.min(fadeIn, fadeOut))
        el.style.transform = `translate3d(${el._x! - el._w! / 2}px, ${el._y! - el._h! / 2}px, ${rel}px)`
        el.style.visibility = rel > 630 ? 'hidden' : 'visible'
      })
      render(0)
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: () => `+=${SCREENS * innerHeight}`, pin: stage, scrub: true, anticipatePin: 1, invalidateOnRefresh: true,
        onRefresh: (s) => { place(); render(s.progress * total) },
        onUpdate: (s) => {
          render(s.progress * total)
          gsap.set(bar, { scaleX: s.progress })
          gsap.set(title, { opacity: 1 - gsap.utils.clamp(0, 1, s.progress * 9), y: -s.progress * 400 })
        },
      })
      return () => items.forEach((el) => el.removeAttribute('style'))
    })
  }, { scope: root })

  return (
    <section className="walk" id="inside" aria-labelledby="walk-h" ref={root}>
      <div className="walk__stage">
        <div className="walk__title"><h2 className="t t-1" id="walk-h"><TitleText title={WALK.title} /></h2></div>
        <div className="walk__world">
          {WALK.items.map((it, i) => <div className="wi" key={i}><Item it={it} h={it.kind === 'img' ? 340 : 0} /></div>)}
        </div>
        <div className="walk__bar"><i /></div>
      </div>
      <div className="walk__flat">
        <div className="shell walk__flat-h"><h2 className="t t-1"><TitleText title={WALK.title} /></h2></div>
        <ul className="walk__rail" role="list">
          {WALK.items.map((it, i) => <li key={i}><Item it={it} h={340} /></li>)}
        </ul>
      </div>
    </section>
  )
}

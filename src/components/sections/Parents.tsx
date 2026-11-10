import { useRef } from 'react'
import { PARENTS } from '../../data/parents'
import { gsap, lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Cta } from '../ui/Cta'
import { TitleText } from '../ui/Highlight'
import { Photo } from '../ui/Photo'
import { Tag } from '../ui/Tag'
import { WolfMark } from '../ui/WolfMark'

// the logo wolf in a row behind the backpack, as behind Fred (the outer ones run off the card)
const WOLVES = [-2, -1, 0, 1, 2]

/** A hand-drawn arrow, drawn in on scroll. `to` is where it points: the backpack, right or left of the note. */
function Arrow({ variant, to }: { variant: 'down' | 'up'; to: 'right' | 'left' }) {
  const d = variant === 'down'
    ? { line: 'M6 14 C 40 6, 78 18, 102 46', head: 'M86 42 L103 48 L101 30' }
    : { line: 'M6 50 C 38 58, 78 46, 102 18', head: 'M86 22 L103 16 L100 34' }
  return (
    <svg className={`pk__arrow pk__arrow--${to}`} viewBox="0 0 110 64" aria-hidden="true" focusable="false">
      <path d={d.line} pathLength={1} />
      <path d={d.head} pathLength={1} />
    </svg>
  )
}

function Note({ lines, body, side, variant }: { title: string; lines: string[]; body: string; side: 'l' | 'r'; variant: 'down' | 'up' }) {
  return (
    <div className={`pk__note pk__note--${side}`}>
      <b>{lines.map((l, i) => <span key={i}>{l}{i < lines.length - 1 ? ' ' : ''}</span>)}</b>
      <p>{body}</p>
      <Arrow variant={variant} to={side === 'l' ? 'right' : 'left'} />
    </div>
  )
}

/**
 * 03 · "Is it good for my child?" Title left, description right; below, the backpack in a black card
 * the width of the Professor's, the same way as Fred: grey wolves behind, the bag coming up out of the
 * top and its foot cut by the card's bottom edge, so it stands. The notes are no post-its: hand-lettered
 * lines on the white, outside the card, either side of the bag, with arrows drawn to it. The button sits on the card's edge. On a phone the card comes first and the notes follow.
 */
export function Parents() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (!motionOK()) return
    lines(root.current!.querySelector('h2')!)
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.pk', start: 'top 75%', once: true } })
    tl.fromTo('.pk__panel', { yPercent: 18, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out' }, 0)
      .fromTo('.pk__wolf', { scale: 0.8, rotation: -6 }, { scale: 1, rotation: 0, duration: 1, ease: 'expo.out', stagger: { each: 0.06, from: 'center' } }, 0.05)
      .fromTo('.pack', { yPercent: 22 }, { yPercent: 0, duration: 1.1, ease: 'expo.out' }, 0.1)
      .fromTo('.pk__note', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.16 }, 0.5)
      .fromTo('.pk__arrow path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut', stagger: 0.12 }, 0.7)
  }, { scope: root })

  const [n1, n2] = PARENTS.notesLeft
  const [n3] = PARENTS.notesRight
  return (
    <section className="sec wt par" id="kids" aria-labelledby="par-h" ref={root}>
      <div className="shell">
        <div className="par__top">
          <div>
            <Tag>{PARENTS.tag}</Tag>
            <h2 className="t t-2 par__h" id="par-h"><TitleText title={PARENTS.title} /></h2>
          </div>
          <p className="lead">{PARENTS.lead}</p>
        </div>
        <div className="pk">
          <div className="pk__panel" aria-hidden="true"><div className="pk__wolves">{WOLVES.map((i) => <WolfMark key={i} className="pk__wolf" />)}</div></div>
          <div className="pk__bag">
            <picture>
              <source media="(min-width: 1000px)" srcSet={`${PARENTS.bagWide.src.replace(/.webp$/, '-sm.webp')} ${PARENTS.bagWide.sm}w, ${PARENTS.bagWide.src} ${PARENTS.bagWide.w}w`} sizes="92vw" width={PARENTS.bagWide.w} height={PARENTS.bagWide.h} />
              <Photo photo={PARENTS.bag} className="pack" alt="" sizes="86vw" />
            </picture>
          </div>
          <div className="pk__notes">
            <div className="pk__col pk__col--l">
              <Note {...n1} side="l" variant="down" />
              <Note {...n2} side="l" variant="down" />
            </div>
            <div className="pk__col pk__col--r">
              <Note {...n3} side="r" variant="down" />
            </div>
          </div>
        </div>
        <div className="par__cta"><Cta tone="r" who="child" /></div>
      </div>
    </section>
  )
}

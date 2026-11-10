import { useRef, useState } from 'react'
import { REVIEWS } from '../../data/reviews'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Icon } from '../ui/Icon'
import { TitleText } from '../ui/Highlight'

const N = REVIEWS.items.length

/**
 * 11 · "Do other people like it?" A fan of cards, the active one yellow (its quote seal black), the
 * sides fading out under a mask. Prev/next and dot bars; a side card is a button to itself. Cards
 * out of view are inert, never aria-hidden while visible (PRD 0.4.2(8)).
 */
export function Reviews() {
  const root = useRef<HTMLElement>(null)
  const [cur, setCur] = useState(0)
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })
  const go = (i: number) => setCur((i + N) % N)

  return (
    <section className="sec wt" id="reviews" aria-labelledby="rv-h" ref={root}>
      <div className="shell">
        <div className="head head--c">
          <h2 className="t t-1" id="rv-h"><TitleText title={REVIEWS.title} /></h2>
          <a className="gbadge" href={REVIEWS.google.url} target="_blank" rel="noopener"><Icon name="g" />{REVIEWS.google.label}</a>
        </div>
        <div className="rv" role="region" aria-roledescription="carousel" aria-label={REVIEWS.carouselLabel}>
          <div className="rv__stage" aria-live="polite">
            {REVIEWS.items.map((r, i) => {
              let d = i - cur
              if (d > N / 2) d -= N
              if (d < -N / 2) d += N
              const a = Math.abs(d), far = a > 2
              return (
                <article
                  key={i}
                  className={`rc${d === 0 ? ' on' : ''}`}
                  aria-roledescription="slide"
                  aria-label={REVIEWS.slideLabel(i + 1, N)}
                  inert={far}
                  style={{ zIndex: 10 - a, opacity: far ? 0 : 1 - a * 0.22, transform: `translateX(${d * 58}%) scale(${1 - a * 0.1}) rotate(${d * 2.5}deg)` }}
                  onClick={() => d !== 0 && go(i)}
                >
                  <span className="rc__q" aria-hidden="true">&ldquo;</span>
                  <blockquote>{r.text}</blockquote>
                  <div className="rc__who">
                    <span className="rc__av" aria-hidden="true">{r.initial}</span>
                    <span><b>{r.name}</b><small>{r.meta}</small></span>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="rv__nav">
            <button type="button" aria-label={REVIEWS.prev} onClick={() => go(cur - 1)}><Icon name="prev" /></button>
            <span className="rv__dots" aria-hidden="true">{REVIEWS.items.map((_, i) => <i key={i} className={i === cur ? 'on' : undefined} />)}</span>
            <button type="button" aria-label={REVIEWS.next} onClick={() => go(cur + 1)}><Icon name="go" /></button>
          </div>
        </div>
      </div>
    </section>
  )
}

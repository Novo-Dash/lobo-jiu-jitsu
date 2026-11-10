import { useRef, useState } from 'react'
import { WHY } from '../../data/why'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { TitleText } from '../ui/Highlight'
import { Photo } from '../ui/Photo'

/**
 * 06 · "Why here and not the franchise?" Three photo panels side by side; the active one grows
 * (flex 3.4) and shows its number, title and text, the others their vertical label. Hover, focus or
 * tap only, no pin (PRD 10/06). Phones: stacked, all open.
 */
export function Why() {
  const root = useRef<HTMLElement>(null)
  const [on, setOn] = useState(0)
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })

  return (
    <section className="sec wt why" id="why" aria-labelledby="why-h" ref={root}>
      <div className="fit">
        <div className="shell">
          <div className="head head--row"><h2 className="t t-1" id="why-h"><TitleText title={WHY.title} /></h2></div>
          <div className="why__panels">
            {WHY.panels.map((p, i) => (
              <article
                key={p.n}
                className={`wp${i === on ? ' on' : ''}`}
                tabIndex={0}
                aria-labelledby={`why-p${i}`}
                onMouseEnter={() => setOn(i)}
                onFocus={() => setOn(i)}
                onClick={() => setOn(i)}
              >
                <Photo photo={p.photo} sizes="(max-width: 899px) 100vw, 60vw" />
                <span className="wp__n" aria-hidden="true">{p.n}</span>
                <span className="wp__v" aria-hidden="true">{p.label}</span>
                <div className="wp__b">
                  <h3 className="t" id={`why-p${i}`}>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

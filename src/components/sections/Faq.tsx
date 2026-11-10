import { useRef } from 'react'
import { FAQ } from '../../data/faq'
import { SITE } from '../../data/site'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { Accordion } from '../ui/Accordion'
import { Cta } from '../ui/Cta'
import { TitleText } from '../ui/Highlight'
import { Icon } from '../ui/Icon'

/** 12 · The remaining doubts: one centred column, no numbers, the open one turns yellow. */
export function Faq() {
  const root = useRef<HTMLElement>(null)
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })
  return (
    <section className="sec wt" id="faq" aria-labelledby="faq-h" ref={root}>
      <div className="shell">
        <div className="head head--c"><h2 className="t t-1" id="faq-h"><TitleText title={FAQ.title} /></h2></div>
        <Accordion items={FAQ.items} />
        <div className="faq__cta">
          <Cta tone="r" source="faq" />
          <a className="call" href={SITE.phone.tel}><Icon name="phone" /><u>{SITE.phone.display}</u></a>
        </div>
      </div>
    </section>
  )
}

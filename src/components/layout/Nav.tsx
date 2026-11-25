import { useEffect, useRef, useState } from 'react'
import { NAV, SITE } from '../../data/site'
import { Icon } from '../ui/Icon'

/**
 * Floating pill: logo, five links and only the phone (PRD 10/00: no CTA in the nav). It takes the
 * colour of the section under it (Adryan, 10/11): black over the dark ones (data-nav="dark": hero,
 * final CTA, find us, footer), white over the white ones. Read at the pill's middle on every frame
 * that scrolled; the prerendered page starts black, which is what sits under it at the top.
 */
export function Nav() {
  const ref = useRef<HTMLElement>(null)
  const [light, setLight] = useState(false)
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const nav = ref.current!, r = nav.querySelector('.nav__in')!.getBoundingClientRect()
      const under = document.elementsFromPoint(innerWidth / 2, r.top + r.height / 2).find((e) => !nav.contains(e))
      setLight(!document.documentElement.classList.contains('v2') && !!under && !under.closest('[data-nav="dark"]'))
    }
    const on = () => { raf ||= requestAnimationFrame(read) }
    read()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [])

  return (
    <header className={`nav${light ? ' is-light' : ''}`} id="nav" ref={ref}>
      <div className="nav__in">
        <a className="nav__logo" href="#top" aria-label={NAV.homeLabel}>
          <img className="nav__lg nav__lg--w" src={SITE.logo.src} width={SITE.logo.w} height={SITE.logo.h} alt={SITE.logo.alt} />
          <img className="nav__lg nav__lg--k" src={SITE.logoBlack.src} width={SITE.logoBlack.w} height={SITE.logoBlack.h} alt="" aria-hidden="true" fetchPriority="low" />
        </a>
        <nav className="nav__links" aria-label={NAV.sectionsLabel}>
          {NAV.links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <a className="nav__tel" href={SITE.phone.tel} aria-label={NAV.telLabel}><Icon name="phone" /></a>
      </div>
    </header>
  )
}

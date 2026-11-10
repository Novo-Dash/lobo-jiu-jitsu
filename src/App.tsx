import { useEffect } from 'react'
import { Nav } from './components/layout/Nav'
import { SkipLink } from './components/layout/SkipLink'
import { PushpinTearFooter } from './components/footer/PushpinTearFooter'
import { Adults } from './components/sections/Adults'
import { Faq } from './components/sections/Faq'
import { FinalCta } from './components/sections/FinalCta'
import { FirstClass } from './components/sections/FirstClass'
import { Hero } from './components/sections/Hero'
import { Location } from './components/sections/Location'
import { Parents } from './components/sections/Parents'
import { Pricing } from './components/sections/Pricing'
import { Professor } from './components/sections/Professor'
import { Programs } from './components/sections/Programs'
import { Reviews } from './components/sections/Reviews'
import { Schedule } from './components/sections/Schedule'
import { WalkIn } from './components/sections/WalkIn'
import { Why } from './components/sections/Why'
import { Sprite } from './components/ui/Sprite'
import { ScrollTrigger } from './lib/gsap'
import { scrollToTarget, startLenis } from './lib/lenis'
import { motionOK } from './lib/motion'
import { useBooking } from './nd'

/** The page, in the order of the mental journey (PRD 6). */
export default function App() {
  const { isOpen } = useBooking()

  useEffect(() => {
    const stopLenis = motionOK() ? startLenis() : () => {}
    // anchors: through Lenis, so the pinned scenes measure the same scroll
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      const id = a?.getAttribute('href')
      if (!a || !id || id === '#') return
      const target = id === '#top' ? 0 : document.querySelector<HTMLElement>(id)
      if (target === null) return
      e.preventDefault()
      scrollToTarget(target, !motionOK())
    }
    document.addEventListener('click', onClick)
    // the pins measure again once fonts and photos are in (PRD 14)
    const refresh = () => ScrollTrigger.refresh()
    void document.fonts?.ready.then(refresh)
    addEventListener('load', refresh)
    return () => { stopLenis(); document.removeEventListener('click', onClick); removeEventListener('load', refresh) }
  }, [])

  // the page holds still while the kit's booking form is open
  useEffect(() => {
    const l = window.__lenis
    if (!l) return
    if (isOpen) l.stop(); else l.start()
  }, [isOpen])

  return (
    <>
      <Sprite />
      <SkipLink />
      <Nav />
      <main id="main">
        <Hero />
        <Programs />
        <Parents />
        <Adults />
        <Professor />
        <Why />
        <WalkIn />
        <FirstClass />
        <Schedule />
        <Pricing />
        <Reviews />
        <Faq />
        <FinalCta />
        <Location />
      </main>
      <PushpinTearFooter />
    </>
  )
}

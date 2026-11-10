import { useEffect, useRef, useState } from 'react'
import { LOCATION } from '../../data/location'
import { SITE } from '../../data/site'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { TitleText } from '../ui/Highlight'
import { Icon } from '../ui/Icon'
import { Photo } from '../ui/Photo'
import { WolfMark } from '../ui/WolfMark'
import { grainDataUrl } from '../footer/tear'

const v = (n: string) => ({ fill: `var(--color-map-${n})` })

/** The prototype's drawn map: it stays under the Google embed and is all you see if the embed fails. */
function DrawnMap() {
  return (
    <svg className="map__draw" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="800" height="520" style={v('0')} />
      <g style={v('1')}><rect x="40" y="40" width="180" height="120" rx="6" /><rect x="250" y="40" width="210" height="120" rx="6" /><rect x="490" y="40" width="270" height="120" rx="6" /><rect x="40" y="200" width="180" height="140" rx="6" /><rect x="490" y="200" width="120" height="140" rx="6" /><rect x="640" y="200" width="120" height="140" rx="6" /><rect x="40" y="380" width="300" height="110" rx="6" /><rect x="370" y="380" width="390" height="110" rx="6" /></g>
      <rect x="255" y="205" width="200" height="130" rx="6" style={v('2')} />
      <path d="M300 230h110v70H300z" style={v('3')} />
      <g fill="none" style={{ stroke: 'var(--color-map-4)' }} strokeWidth="22" strokeLinecap="round"><path d="M0 180h800M0 360h800M235 0v520M475 0v520" /></g>
      <g fill="none" style={{ stroke: 'var(--color-map-5)' }} strokeWidth="10"><path d="M625 160v220M0 100h40M760 270h40" /></g>
      <path d="M0 180h800M475 0v520" className="map__dash" strokeWidth="3" strokeDasharray="2 14" strokeLinecap="round" />
      <text x="483" y="505" className="map__txt" transform="rotate(-90 483 505)">{LOCATION.street}</text>
      <rect x="640" y="210" width="110" height="120" rx="10" style={v('park')} opacity=".7" />
      <text x="660" y="275" className="map__txt map__txt--park">{LOCATION.park}</text>
    </svg>
  )
}

/**
 * 14 · "Where is it?" Title and line centred; the real Google map (embed without a key, dark skin) is
 * the section's background, fading into the ink on top and into the footer at the bottom, the wolf
 * pin pulsing where Google drops its marker (the CG North Lakeland footer). On the map: the storefront
 * on the left, the visit card on the right (address, directions, call, contacts) on the footer's ink.
 * On a phone the map is a band under the title and the cards follow. The embed loads only near the
 * screen; the drawn map is the fallback underneath.
 */
export function Location() {
  const root = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  const [loaded, setLoaded] = useState(false)
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })
  useEffect(() => { root.current!.style.setProperty('--grain', `url(${grainDataUrl()})`) }, [])
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect() } }, { rootMargin: '600px' })
    io.observe(root.current!)
    return () => io.disconnect()
  }, [])

  return (
    <section className="sec dk find" id="location" data-nav="dark" aria-labelledby="loc-h" ref={root}>
      <div className="shell">
        <div className="head head--c"><h2 className="t t-1" id="loc-h"><TitleText title={LOCATION.title} /></h2><p className="lead">{LOCATION.lead}</p></div>
        <div className="find__grid">
          <div className="find__win">
            <div className={`map${loaded ? ' is-live' : ''}`}>
              <DrawnMap />
              {near && <iframe className="map__frame" src={SITE.maps.embed} title={LOCATION.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} onLoad={() => setLoaded(true)} />}
              <span className="map__shade" aria-hidden="true" />
              <span className="map__mark" aria-hidden="true">
                <span className="map__pulse" />
                <span className="map__pin"><span><WolfMark /></span></span>
              </span>
            </div>
          </div>
          <div className="store"><Photo photo={LOCATION.storefront} sizes="(max-width: 999px) 100vw, 380px" /><span>{LOCATION.storeNote}</span></div>
          <div className="visit">
            <b>{LOCATION.card.name}</b>
            <p>{LOCATION.card.line1}<br />{LOCATION.card.line2}</p>
            <div className="map__btns">
              <a className="pill pill--y" href={SITE.maps.directions} target="_blank" rel="noopener"><Icon name="pin" />{LOCATION.card.directions}</a>
              <a className="pill" href={SITE.phone.tel}><Icon name="phone" />{LOCATION.card.call}</a>
            </div>
            <ul className="contacts">
              <li><a href={SITE.phone.tel}><i><Icon name="phone" /></i><span>{SITE.phone.display}<small>{LOCATION.contacts.callOrText}</small></span></a></li>
              <li><a href={`mailto:${SITE.email}`}><i><Icon name="mail" /></i><span>{SITE.email}</span></a></li>
              <li><a href={SITE.social.instagram.url} target="_blank" rel="noopener"><i><Icon name="ig" /></i><span>{SITE.social.instagram.handle}</span></a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

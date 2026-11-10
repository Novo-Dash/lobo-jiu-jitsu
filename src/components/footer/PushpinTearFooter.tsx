import { useEffect, useRef, useState } from 'react'
import { FOOTER } from '../../data/footer'
import { SITE } from '../../data/site'
import { useNextClass } from '../../hooks/useNextClass'
import { scrollToTarget } from '../../lib/lenis'
import { useBooking } from '../../nd'
import { Icon } from '../ui/Icon'
import { clamp01, easeInOut, easeTear, FLAPS, flapOpen, flapPoly, grainDataUrl, introYs, makeTear, morphYs, polyD, sheetD, START, XS, type Tear } from './tear'

const sc = (v: string) => ({ stopColor: `var(${v})` })

/** The pushpin, shaded from the brand yellow (stops in app.css via color-mix). */
function PinSvg() {
  return (
    <svg viewBox="0 0 100 200" className="tpf-pin-svg" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="tpPs" x1="0" x2="1" y1="0" y2="0"><stop offset="0" style={sc('--pin-lo')} /><stop offset=".24" style={sc('--pin-mid')} /><stop offset=".4" style={sc('--pin-hi')} /><stop offset=".58" style={sc('--pin-mid')} /><stop offset="1" style={sc('--pin-deep')} /></linearGradient>
        <radialGradient id="tpPt" cx=".38" cy=".3" r=".8"><stop offset="0" style={sc('--pin-hi')} /><stop offset=".55" style={sc('--pin-mid')} /><stop offset="1" style={sc('--pin-lo')} /></radialGradient>
        <linearGradient id="tpPn" x1="0" x2="1" y1="0" y2="0"><stop offset="0" style={sc('--color-pin-needle-1')} /><stop offset=".4" style={sc('--color-pin-needle-2')} /><stop offset=".7" style={sc('--color-pin-needle-3')} /><stop offset="1" style={sc('--color-pin-needle-4')} /></linearGradient>
        <filter id="tpPb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4" /></filter>
      </defs>
      <path d="M48.3 112h3.4l-.7 76-1 4-1-4z" fill="url(#tpPn)" /><ellipse cx="50" cy="191.5" rx="3.2" ry="1.1" className="tpf-ink-fill" opacity=".35" />
      <path d="M28 103v6.5a22 7 0 0 0 44 0V103z" fill="url(#tpPs)" /><ellipse cx="50" cy="103" rx="22" ry="7" fill="url(#tpPt)" />
      <path d="M41.5 38c1.6 16 4.6 26 3 36-1.8 10-13 19-14.6 29h40.2c-1.6-10-12.8-19-14.6-29-1.6-10 1.4-20 3-36z" fill="url(#tpPs)" />
      <path d="M16 22v14a34 13 0 0 0 68 0V22z" fill="url(#tpPs)" /><ellipse cx="50" cy="22" rx="34" ry="13" fill="url(#tpPt)" />
      <ellipse cx="50" cy="22" rx="33" ry="12.3" fill="none" className="tpf-white-stroke" strokeOpacity=".28" strokeWidth=".8" />
      <ellipse cx="37" cy="17.5" rx="12" ry="4" className="tpf-white-fill" opacity=".7" filter="url(#tpPb)" />
      <path d="M22 38c4 4.5 9.5 6.4 15 7" className="tpf-white-stroke" strokeOpacity=".35" strokeWidth="2" fill="none" strokeLinecap="round" filter="url(#tpPb)" />
      <path d="M45 50c.8 8 1.6 14 .8 22" className="tpf-white-stroke" strokeOpacity=".45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/**
 * 15 · The torn poster (reference/anexo-footer-LOBO.md). A black poster sheet pinned up, torn at the
 * bottom. Coming into view, the sheet's content assembles, the pin drops and stabs, the sheet rips
 * from the pin outward; underneath, the paper with Lobo's black logo printed on it. The flaps lift
 * toward the cursor, the pin leans with the mouse, and pulling the pin rips a new edge.
 * Reduced motion: already assembled and torn, no animation.
 */
export function PushpinTearFooter() {
  const { open } = useBooking()
  const next = useNextClass()
  const root = useRef<HTMLElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const sheet = useRef<SVGPathElement>(null)
  const rim = useRef<SVGPathElement>(null)
  const grain = useRef<SVGImageElement>(null)
  const flaps = useRef<(SVGPathElement | null)[]>([])
  const grads = useRef<(SVGLinearGradientElement | null)[]>([])
  const pullRef = useRef<() => void>(() => {})
  const [stage, setStage] = useState(0)
  const [armed, setArmed] = useState(false) // the assembled-from-nothing states exist only once the script runs
  const [hit, setHit] = useState(false)
  const [pin, setPin] = useState<'idle' | 'lift' | 'stab'>('idle')
  const [tilt, setTilt] = useState(0)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const el = root.current!, RM = matchMedia('(prefers-reduced-motion: reduce)').matches
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)) }
    grain.current?.setAttribute('href', grainDataUrl())
    if (!RM) setArmed(true)
    const s = { W: 0, H: 0, tear: makeTear(11) as Tear, prev: null as Tear | null, from: [] as number[], ys: [] as number[], mode: 'wait' as 'wait' | 'intro' | 'morph' | 'rest', t0: 0, dur: 1, raf: 0, px: -1e4, py: -1e4, lift: new Array(FLAPS).fill(0) as number[], busy: false, seed: 11, torn: false }

    const draw = (k: number, f: Tear['flaps'][number] | undefined, o: number, ys: number[]) => {
      const p = flaps.current[k], g = grads.current[k]
      if (!p || !g) return
      if (!f || o < 0.01) { p.setAttribute('d', ''); return }
      const pts = flapPoly(ys, f, s.W, s.H, o), b = Math.min(ys.length - 1, f.at + f.span), tip = pts[f.span + 3]
      p.setAttribute('d', polyD(pts))
      g.setAttribute('x1', String(((XS[f.at] + XS[b]) / 2) * s.W)); g.setAttribute('y1', String(((ys[f.at] + ys[b]) / 2) * s.H))
      g.setAttribute('x2', String(tip[0])); g.setAttribute('y2', String(tip[1]))
    }
    const frame = (now: number) => {
      s.raf = 0
      const { W, H, tear } = s
      if (!W || !H) return
      let busy = false, ys: number[]
      const openNew = new Array(FLAPS).fill(1) as number[], openOld = new Array(FLAPS).fill(0) as number[]
      if (s.mode === 'wait') { ys = tear.ys.map(() => START); openNew.fill(0) }
      else if (s.mode === 'intro') { const p = (now - s.t0) / s.dur; ys = introYs(tear, Math.min(1, p)); tear.flaps.forEach((f, k) => { openNew[k] = flapOpen(tear, f, Math.min(1, p)) }); if (p >= 1) s.mode = 'rest'; else busy = true }
      else if (s.mode === 'morph') { const p = (now - s.t0) / s.dur; ys = morphYs(s.from, tear, Math.min(1, p)); openNew.fill(easeTear((p - 0.5) / 0.5)); openOld.fill(1 - easeInOut(p / 0.35)); if (p >= 1) s.mode = 'rest'; else busy = true }
      else ys = tear.ys
      s.ys = ys
      tear.flaps.forEach((f, k) => {
        const b = Math.min(ys.length - 1, f.at + f.span), mx = ((XS[f.at] + XS[b]) / 2) * W, my = ((ys[f.at] + ys[b]) / 2) * H
        const target = RM ? 0 : clamp01(1 - Math.hypot(s.px - mx, s.py - my) / (0.2 * Math.max(W, 520)))
        s.lift[k] += (target - s.lift[k]) * 0.14
        if (Math.abs(target - s.lift[k]) > 0.003) busy = true
        openNew[k] *= 1 + 0.32 * s.lift[k]
      })
      sheet.current?.setAttribute('d', sheetD(ys, W, H, tear.rim))
      rim.current?.setAttribute('d', sheetD(ys, W, H))
      for (let k = 0; k < FLAPS; k++) { draw(k, tear.flaps[k], openNew[k], ys); draw(FLAPS + k, s.prev?.flaps[k], openOld[k], ys) }
      if (busy) s.raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!s.raf) s.raf = requestAnimationFrame(frame) }

    const ro = new ResizeObserver(() => {
      s.W = el.clientWidth; s.H = el.clientHeight
      const v = svg.current!
      v.setAttribute('width', String(s.W)); v.setAttribute('height', String(s.H)); v.setAttribute('viewBox', `0 0 ${s.W} ${s.H}`)
      kick()
    })
    ro.observe(el)

    // the opening: chrome, pin, rip
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || s.torn) return
      s.torn = true; io.disconnect()
      if (RM) { setStage(3); s.mode = 'rest'; kick(); return }
      setStage(1)
      later(() => setStage(2), 640)
      later(() => { setHit(true); setStage(3); s.mode = 'intro'; s.t0 = performance.now(); s.dur = 1550; kick() }, 1140)
      later(() => setHit(false), 1480)
    }, { threshold: 0.22 })
    io.observe(el)

    // the flaps lift toward the pointer, the pin leans
    const move = (e: PointerEvent) => {
      if (RM) return
      const r = el.getBoundingClientRect(); s.px = e.clientX - r.left; s.py = e.clientY - r.top
      setTilt(Math.max(-9, Math.min(9, (s.px / r.width - 0.5) * 18)))
      kick()
    }
    const leave = () => { s.px = s.py = -1e4; setTilt(0); kick() }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)

    // pull the pin: it lifts, the sheet re-rips a new edge, the pin stabs back
    pullRef.current = () => {
      if (s.busy || s.mode === 'wait') return
      const swap = () => { s.seed += 1; s.prev = s.tear; s.from = s.ys.length ? s.ys : s.tear.ys; s.tear = makeTear(s.seed) }
      if (RM) { swap(); s.prev = null; s.mode = 'rest'; kick(); return }
      s.busy = true; setPin('lift')
      later(() => { swap(); s.mode = 'morph'; s.t0 = performance.now(); s.dur = 1150; kick() }, 300)
      later(() => setPin('stab'), 1280)
      later(() => { setPin('idle'); s.busy = false }, 1720)
    }

    return () => {
      ro.disconnect(); io.disconnect(); timers.forEach(clearTimeout); cancelAnimationFrame(s.raf)
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave)
    }
  }, [])

  const copy = () => {
    const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 1600) }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(SITE.email).then(() => flash(FOOTER.copied), () => flash(SITE.email))
    else flash(SITE.email)
  }
  const cls = ['tpf', armed && 'armed', stage >= 1 && 's1', stage >= 2 && 's2', stage >= 3 && 's3', hit && 'is-hit'].filter(Boolean).join(' ')

  return (
    <footer className={cls} id="tpf" data-nav="dark" ref={root}>
      <svg className="tpf-stage" ref={svg} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="tpfV" cx=".5" cy=".78" r=".75"><stop offset=".45" style={sc('--color-white')} stopOpacity="0" /><stop offset="1" style={sc('--color-ink')} stopOpacity=".07" /></radialGradient>
          <linearGradient id="tpfL" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" style={sc('--color-white')} stopOpacity=".07" /><stop offset=".55" style={sc('--color-white')} stopOpacity="0" /><stop offset="1" style={sc('--color-black')} stopOpacity=".2" /></linearGradient>
          <pattern id="tpfG" width="160" height="160" patternUnits="userSpaceOnUse"><image ref={grain} width="160" height="160" /></pattern>
          <filter id="tpfD" x="-5%" y="-5%" width="110%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="3.5" className="tpf-shadow-flood" floodOpacity=".28" /></filter>
          <filter id="tpfF" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="-2" dy="4" stdDeviation="4" className="tpf-shadow-flood" floodOpacity=".24" /></filter>
          {Array.from({ length: FLAPS * 2 }, (_, k) => (
            <linearGradient key={k} id={`tpfFg${k}`} gradientUnits="userSpaceOnUse" ref={(g) => { grads.current[k] = g }}>
              <stop offset="0" style={sc('--tpf-flap-0')} /><stop offset=".5" style={sc('--tpf-flap-1')} /><stop offset="1" style={sc('--color-white')} />
            </linearGradient>
          ))}
          <path id="tpfS" ref={sheet} />
        </defs>
        <rect className="tpf-paper" width="100%" height="100%" />
        <rect width="100%" height="100%" fill="url(#tpfV)" style={{ mixBlendMode: 'multiply' }} />
        <rect width="100%" height="100%" fill="url(#tpfG)" opacity=".3" />
        <g className="tpf-sheet-g" filter="url(#tpfD)"><path className="tpf-rim" ref={rim} /><use href="#tpfS" className="tpf-sheet" /></g>
        <use href="#tpfS" fill="url(#tpfL)" />
        <use href="#tpfS" fill="url(#tpfG)" opacity=".45" />
        <g filter="url(#tpfF)">{Array.from({ length: FLAPS * 2 }, (_, k) => <path key={k} fill={`url(#tpfFg${k})`} ref={(p) => { flaps.current[k] = p }} />)}</g>
      </svg>

      <div className="tpf-z tpf-top">
        <div className="tpf-row tpf-h" style={{ ['--i' as string]: 0 }}>
          <button type="button" className="tpf-ib tpf-up" aria-label={FOOTER.backToTop} title={FOOTER.backToTop} onClick={() => scrollToTarget(0)}><Icon name="up" className="tpf-ico" /></button>
          <span className="tpf-gap" />
          <a className="tpf-ib" href={SITE.social.instagram.url} target="_blank" rel="noopener" aria-label={SITE.social.instagram.label} title={SITE.social.instagram.label}><Icon name="ig" className="tpf-ico" /></a>
          <a className="tpf-ib" href={SITE.social.facebook.url} target="_blank" rel="noopener" aria-label={SITE.social.facebook.label} title={SITE.social.facebook.label}><Icon name="fb" className="tpf-ico" /></a>
        </div>
        <a className="tpf-logo tpf-h" href="#top" style={{ ['--i' as string]: 1 }}><img src={SITE.logo.src} width={SITE.logo.w} height={SITE.logo.h} alt={SITE.logo.alt} loading="lazy" /></a>
        <div className="tpf-h tpf-mailbox" style={{ ['--i' as string]: 2 }}>
          <button type="button" className="tpf-mail" aria-label={FOOTER.copyEmail(SITE.email)} title={FOOTER.copyTitle} onClick={copy}><span>{SITE.email}</span><Icon name="copy" className="tpf-ico" /></button>
          <span className={`tpf-toast${toast ? ' on' : ''}`} role="status" aria-live="polite">{toast}</span>
        </div>
      </div>

      <div className="tpf-z tpf-news tpf-h" style={{ ['--i' as string]: 3 }}>
        <span>{FOOTER.news}</span>
        <button type="button" className="tpf-pill" onClick={() => open()}>
          <span>{FOOTER.pill}</span><span className="tpf-knob" aria-hidden="true"><Icon name="arrow" className="tpf-ico" /></span>
        </button>
      </div>
      <a className="tpf-z tpf-status tpf-h" href="#schedule" style={{ ['--i' as string]: 5 }}>
        <i className="tpf-live" aria-hidden="true" /><span>{next?.label || FOOTER.scheduleFallback}</span><em className="tpf-clock">{next?.clock ?? ''}</em>
      </a>

      <nav className="tpf-z tpf-col tpf-h l" style={{ ['--i' as string]: 6 }} aria-label={FOOTER.colPrograms.label}>
        <h3>{FOOTER.colPrograms.title}<Icon name="wave" className="tpf-ico" /></h3>
        <ul>{FOOTER.colPrograms.links.map((l) => <li key={l}><a href="#programs">{l}</a></li>)}</ul>
        <button type="button" className="tpf-big" onClick={() => open()}>{FOOTER.colPrograms.big}</button>
      </nav>
      <nav className="tpf-z tpf-col tpf-h r" style={{ ['--i' as string]: 7 }} aria-label={FOOTER.colSchool.label}>
        <h3>{FOOTER.colSchool.title}<Icon name="wave" className="tpf-ico" /></h3>
        <ul>{FOOTER.colSchool.links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}</ul>
        <a className="tpf-big" href={SITE.phone.tel}>{FOOTER.colSchool.big}</a>
      </nav>

      <button type="button" className="tpf-pin" data-pin={pin} aria-label={FOOTER.pin.label} title={FOOTER.pin.title} style={{ ['--tilt' as string]: `${tilt.toFixed(2)}deg` }} onClick={() => pullRef.current()}>
        <span className="tpf-shadow" aria-hidden="true" />
        <span className="tpf-tilt"><span className="tpf-drop"><span className="tpf-body"><PinSvg /></span></span></span>
      </button>

      <div className="tpf-z tpf-brand tpf-ink">
        <div className="tpf-brand-top tpf-p" style={{ ['--i' as string]: 0 }}>
          <span className="tpf-eye">{FOOTER.paperLine}</span>
          <a className="tpf-bub" href={SITE.phone.tel}><span className="tpf-dots" aria-hidden="true"><i /><i /><i /></span><b>{FOOTER.bubble}</b></a>
        </div>
        <a className="tpf-word" href="#top"><span><img src={SITE.logoBlack.src} width={SITE.logoBlack.w} height={SITE.logoBlack.h} alt={SITE.logoBlack.alt} loading="lazy" /></span></a>
      </div>
      <a className="tpf-z tpf-side tpf-ink tpf-p l" href={SITE.maps.directions} target="_blank" rel="noopener" style={{ ['--i' as string]: 1, left: '27%' }}><span>{FOOTER.directions}</span><Icon name="pin" className="tpf-ico" /></a>
      <a className="tpf-z tpf-side tpf-ink tpf-p r" href={SITE.phone.tel} style={{ ['--i' as string]: 2, left: '73%' }}><span>{SITE.phone.display}</span><Icon name="phone" className="tpf-ico" /></a>
      <div className="tpf-z tpf-foot tpf-ink">
        <span className="tpf-p" style={{ ['--i' as string]: 3 }}>{FOOTER.copyright}</span>
        <span className="tpf-credit tpf-p" style={{ ['--i' as string]: 4 }}>{FOOTER.credit}</span>
        <a className="tpf-handle tpf-p" style={{ ['--i' as string]: 5 }} href={FOOTER.by.url} target="_blank" rel="noopener">{FOOTER.by.label}</a>
      </div>
    </footer>
  )
}

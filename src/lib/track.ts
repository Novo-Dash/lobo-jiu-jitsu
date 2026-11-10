// Meta Pixel + Conversions API + GA4 (PRD 18). The base tags are injected into the <head> by
// scripts/prerender.mjs only when VITE_META_PIXEL_ID / VITE_GA4_ID exist. [CONFIRMAR IDs]
// Every helper is a silent no-op without its id and none can break the page.

type Params = Record<string, unknown>
export type User = { name: string; email: string; phone: string }

const PIXEL = import.meta.env.VITE_META_PIXEL_ID as string | undefined
const w = () => (typeof window === 'undefined' ? null : (window as unknown as { fbq?: (...a: unknown[]) => void; gtag?: (...a: unknown[]) => void }))

const cookie = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1]
export const eventId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

/** GA4 event (all of the funnel). */
export function ga(event: string, params: Params = {}) {
  try { w()?.gtag?.('event', event, params) } catch { /* ignore */ }
}

/** Meta standard event, mirrored to CAPI with the same event_id so Meta counts it once. */
export function meta(event: 'ViewContent' | 'Lead', params: Params = {}, user?: User, id = eventId()) {
  if (!PIXEL) return id
  try { w()?.fbq?.('track', event, params, { eventID: id }) } catch { /* ignore */ }
  void fetch('/api/capi', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({ event, event_id: id, pixel_id: PIXEL, params, url: location.href, fbp: cookie('_fbp'), fbc: cookie('_fbc'), ...(user ? { user } : {}) }),
  }).catch(() => {})
  return id
}

/** Meta custom event (audiences): CTA clicks and the booking funnel. */
function metaCustom(event: string, params: Params = {}) {
  if (!PIXEL) return
  try { w()?.fbq?.('trackCustom', event, params) } catch { /* ignore */ }
}

/** The named events of PRD 18. */
export const track = {
  cta: (source: string, extra: Params = {}) => { ga('cta_click', { source, ...extra }); metaCustom('cta_click', { source }) },
  bookingOpen: (source: string) => { ga('booking_open', { source }); metaCustom('booking_open', { source }) },
  bookingStep: (step: number, source: string) => ga('booking_step', { step, source }),
  view: (section: string) => { ga('view_content', { section }); meta('ViewContent', { content_name: section }) },
  scroll: (percent: number) => ga('scroll_depth', { percent }),
  tel: (where: string) => ga('tel_click', { where }),
  directions: (where: string) => ga('directions_click', { where }),
  pin: () => ga('pin_pull'),
}

/** Page-wide listeners: tel and directions clicks, scroll depth, ViewContent on the key sections. */
export function startPageTracking() {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a')
    if (!a) return
    const where = a.closest('footer') ? 'footer' : a.closest('section,header')?.id || 'page'
    if (a.href.startsWith('tel:')) track.tel(where)
    else if (a.href.includes('google.com/maps/dir')) track.directions(where)
  }
  document.addEventListener('click', onClick)
  const marks = [25, 50, 75, 100], hit = new Set<number>()
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight
    const p = max > 0 ? (scrollY / max) * 100 : 100
    for (const m of marks) if (p >= m - 0.5 && !hit.has(m)) { hit.add(m); track.scroll(m) }
  }
  addEventListener('scroll', onScroll, { passive: true })
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { track.view(e.target.id); io.unobserve(e.target) } }), { threshold: 0.35 })
  ;['programs', 'schedule', 'pricing'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
  return () => { document.removeEventListener('click', onClick); removeEventListener('scroll', onScroll); io.disconnect() }
}

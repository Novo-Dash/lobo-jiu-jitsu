const KEY = 'lobo_attribution'
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'gad_source', 'wbraid', 'gbraid'] as const

const clean = (v: string | null) => { const s = v?.trim(); return s && !s.includes('{{') ? s : null }

/** First touch wins: the landing params, URL and referrer are kept once per session. */
export function captureUTMs() {
  try {
    if (sessionStorage.getItem(KEY)) return
    const q = new URLSearchParams(location.search), out: Record<string, string> = { landing_url: location.href.slice(0, 1000) }
    for (const k of PARAMS) { const v = clean(q.get(k)); if (v) out[k] = v }
    const ref = clean(document.referrer); if (ref) out.landing_referrer = ref
    sessionStorage.setItem(KEY, JSON.stringify(out))
  } catch { /* private mode: best effort */ }
}

export function useUTMs(): Record<string, string> {
  try {
    const s = sessionStorage.getItem(KEY)
    if (s) return JSON.parse(s) as Record<string, string>
  } catch { /* ignore */ }
  const q = new URLSearchParams(typeof location === 'undefined' ? '' : location.search), out: Record<string, string> = {}
  for (const k of PARAMS) { const v = clean(q.get(k)); if (v) out[k] = v }
  return out
}

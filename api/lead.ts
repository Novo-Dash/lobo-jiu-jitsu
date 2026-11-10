/*
 * The booking's proxy to the CRM (PRD 11). The browser never sees the webhook.
 * Env (Vercel): LEAD_WEBHOOK_URL = GHL inbound webhook [CONFIRMAR]; GHL_LOCATION_ID (optional) also
 * sends the house copy to n8n (lead saved in the Novo Dash app). LEAD_WEBHOOK_URL=log only logs (dev).
 */
type Req = { method?: string; body?: Record<string, unknown> | string; headers?: Record<string, string | string[] | undefined> }
type Res = { status: (code: number) => { json: (body: unknown) => void } }

const N8N_COPY = 'https://n8n.novodash.com/webhook/client-lp-lead'
const FIELDS = ['name', 'firstName', 'lastName', 'phone', 'phoneE164', 'email', 'who', 'age', 'experience', 'goal', 'program', 'day', 'time', 'source', 'page_url', 'event_id', 'submittedAt',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'gad_source', 'wbraid', 'gbraid', 'landing_url', 'landing_referrer'] as const

// Best-effort rate limit per warm instance: 5 leads per IP per 10 minutes.
const hits = new Map<string, number[]>()
const limited = (ip: string) => {
  const now = Date.now(), list = (hits.get(ip) ?? []).filter((t) => now - t < 600_000)
  list.push(now); hits.set(ip, list)
  return list.length > 5
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' })
  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}) as Record<string, unknown>
  // honeypot: bots get a success and nothing is sent
  if (str(body.company)) return res.status(200).json({ ok: true })
  const ip = first(req.headers?.['x-forwarded-for'])?.split(',')[0]?.trim() ?? 'unknown'
  if (limited(ip)) return res.status(429).json({ error: 'too many' })

  const lead: Record<string, string> = {}
  for (const k of FIELDS) { const v = str(body[k], k === 'goal' ? 1000 : k.endsWith('url') ? 1000 : 300); if (v) lead[k] = v }
  const phoneDigits = (lead.phone ?? '').replace(/\D/g, '')
  if (!lead.name || phoneDigits.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email ?? '')) return res.status(400).json({ error: 'invalid' })
  const payload = { event: 'lead_captured', academy: 'Lobo Jiu-Jitsu', ...lead }

  const url = process.env.LEAD_WEBHOOK_URL
  if (!url) { console.error('lead: LEAD_WEBHOOK_URL is not set'); return res.status(503).json({ error: 'not configured' }) }
  if (url === 'log') { console.log('lead (log only):', payload); return res.status(200).json({ ok: true }) }

  const post = (to: string, data: unknown) => fetch(to, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  try {
    const location = process.env.GHL_LOCATION_ID
    const [crm] = await Promise.allSettled([post(url, payload), location ? post(N8N_COPY, { ...payload, location_id: location }) : Promise.resolve(null)])
    if (crm.status === 'rejected' || (crm.value && !crm.value.ok)) throw new Error('crm rejected')
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('lead: forward failed', e)
    return res.status(502).json({ error: 'forward failed' })
  }
}

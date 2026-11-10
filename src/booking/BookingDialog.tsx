import { useEffect, useRef, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { BOOKING } from '../data/booking'
import { CTA } from '../data/site'
import { DAY_LONG } from '../data/schedule'
import type { Who } from '../types'
import { WolfMark } from '../components/ui/WolfMark'
import { Icon } from '../components/ui/Icon'
import { useUTMs } from '../hooks/useUTMs'
import { eventId, ga, meta, track } from '../lib/track'
import { useBooking } from './BookingContext'
import { buildPayload, formatPhone, isEmail, isPhone, type Form } from './payload'

const EMPTY: Form = { who: null, age: '', experience: null, goal: '', name: '', phone: '', email: '', company: '' }
type Errors = Partial<Record<'name' | 'phone' | 'email' | 'send', string>>

/**
 * The booking sheet (PRD 11): Who's training? → A little about them → Where should we reach you?
 * Base UI Dialog for the behaviour (focus trap, inert page, Escape, scroll lock), Lobo's skin from the prototype.
 */
export default function BookingDialog() {
  const { isOpen, intent, close } = useBooking()
  const utms = useUTMs()
  const [step, setStep] = useState(1)
  const [f, setF] = useState<Form>(EMPTY)
  const [err, setErr] = useState<Errors>({})
  const [tried, setTried] = useState(false)
  const [sending, setSending] = useState(false)
  const body = useRef<HTMLDivElement>(null)

  // every open starts fresh, already on step 2 when the CTA said who is training
  useEffect(() => {
    if (!isOpen || !intent) return
    setF({ ...EMPTY, who: intent.who ?? null })
    setStep(intent.who ? 2 : 1); setErr({}); setTried(false); setSending(false)
  }, [isOpen, intent])

  useEffect(() => { if (isOpen && step <= 3) track.bookingStep(step, intent?.source ?? 'page') }, [isOpen, step, intent])

  // focus the first control of each step (the title is announced by the dialog)
  useEffect(() => {
    if (!isOpen) return
    const id = requestAnimationFrame(() => body.current?.querySelector<HTMLElement>('button.opt, input, .sh__done .cta')?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(id)
  }, [isOpen, step])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }))
  const validate = (s: Form): Errors => ({
    ...(!s.name.trim() ? { name: BOOKING.errors.name } : {}),
    ...(!isPhone(s.phone) ? { phone: BOOKING.errors.phone } : {}),
    ...(!isEmail(s.email) ? { email: BOOKING.errors.email } : {}),
  })
  useEffect(() => { if (tried) setErr((e) => ({ ...validate(f), ...(e.send ? { send: e.send } : {}) })) }, [f, tried])

  async function send() {
    setTried(true)
    const e = validate(f)
    setErr(e)
    if (Object.keys(e).length) {
      body.current?.querySelector<HTMLElement>(`#f-${Object.keys(e)[0]}`)?.focus()
      return
    }
    setSending(true)
    const id = eventId()
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(buildPayload(f, intent, utms, id)) })
      if (!r.ok) throw new Error(String(r.status))
      meta('Lead', { content_name: intent?.program || f.who, source: intent?.source }, { name: f.name, email: f.email, phone: f.phone }, id)
      ga('generate_lead', { source: intent?.source, who: f.who, program: intent?.program })
      setStep(4)
    } catch {
      setErr({ send: BOOKING.errors.send })
    } finally {
      setSending(false)
    }
  }

  const who = f.who
  const kid = who !== 'adult'
  const from = intent?.program ? `${intent.program}${intent.day ? `, ${DAY_LONG[intent.day]} ${intent.time ?? ''}` : ''}` : ''

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => { if (!o) close() }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="modal-bd" />
        <Dialog.Viewport className="modal">
          <Dialog.Popup className="sheet" initialFocus={false}>
            <div className="sh__top">
              <span className="sh__av" aria-hidden="true"><WolfMark /></span>
              <span>
                <b>{step > 3 ? BOOKING.doneTop : BOOKING.dialogTitle}</b>
                <small>{step > 3 ? BOOKING.donePlace : BOOKING.stepOf(step)}</small>
              </span>
              <Dialog.Close className="sh__x" aria-label={BOOKING.close}><Icon name="close" /></Dialog.Close>
            </div>
            {step <= 3 && (
              <div className="sh__steps" aria-hidden="true">
                {[1, 2, 3].map((i) => <span key={i} className={i === step ? 'on' : i < step ? 'done' : ''} />)}
              </div>
            )}

            <div className="sh__body" ref={body}>
              {step === 1 && (
                <>
                  <Dialog.Title className="t" render={<h2 />}>{BOOKING.who.title}</Dialog.Title>
                  <p>{BOOKING.who.lead}</p>
                  <div className="opts">
                    {(Object.keys(BOOKING.who.options) as Who[]).map((k) => (
                      <button key={k} type="button" className="opt" aria-pressed={who === k} onClick={() => { set('who', k); setStep(2) }}>
                        <b>{BOOKING.who.options[k][0]}</b><small>{BOOKING.who.options[k][1]}</small>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <Dialog.Title className="t" render={<h2 />}>{BOOKING.about.title(who)}</Dialog.Title>
                  <p>{from && <>{BOOKING.about.fromPage} <b>{from}</b>. </>}{BOOKING.about.lead}</p>
                  {kid && (
                    <div className="fld">
                      <label htmlFor="f-age">{who === 'family' ? BOOKING.about.ageFamily : BOOKING.about.age}</label>
                      <input id="f-age" inputMode="numeric" maxLength={2} value={f.age} placeholder={BOOKING.about.agePlaceholder} onChange={(e) => set('age', e.target.value.replace(/\D/g, ''))} />
                    </div>
                  )}
                  <div className="fld" role="group" aria-labelledby="f-exp-l">
                    <span className="fld__l" id="f-exp-l">{BOOKING.about.experience}</span>
                    <div className="opts">
                      {(['new', 'some'] as const).map((k) => (
                        <button key={k} type="button" className="opt" aria-pressed={f.experience === k} onClick={() => set('experience', k)}>
                          <b>{BOOKING.about.exp[k][0]}</b><small>{BOOKING.about.exp[k][1]}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="fld">
                    <label htmlFor="f-goal">{BOOKING.about.goal}</label>
                    <textarea id="f-goal" value={f.goal} placeholder={BOOKING.about.goalPlaceholder} onChange={(e) => set('goal', e.target.value)} />
                  </div>
                  <div className="sh__nav">
                    {!intent?.who && <button type="button" className="sh__back" onClick={() => setStep(1)}>{BOOKING.back}</button>}
                    <button type="button" className="cta cta--sm cta--k" onClick={() => setStep(3)}>
                      <span>{BOOKING.next}</span><span className="cta__w" aria-hidden="true"><WolfMark /></span>
                    </button>
                  </div>
                </>
              )}

              {step === 3 && (
                <form noValidate onSubmit={(e) => { e.preventDefault(); void send() }}>
                  <Dialog.Title className="t" render={<h2 />}>{BOOKING.contact.title}</Dialog.Title>
                  <p>{BOOKING.contact.lead}</p>
                  <div className="fld">
                    <label htmlFor="f-name">{BOOKING.contact.name}</label>
                    <input id="f-name" autoComplete="name" value={f.name} aria-invalid={!!err.name} aria-describedby={err.name ? 'e-name' : undefined} onChange={(e) => set('name', e.target.value)} />
                    {err.name && <span className="err" id="e-name">{err.name}</span>}
                  </div>
                  <div className="fld">
                    <label htmlFor="f-phone">{BOOKING.contact.phone}</label>
                    <input id="f-phone" type="tel" autoComplete="tel" inputMode="tel" value={f.phone} placeholder={BOOKING.contact.phonePlaceholder} aria-invalid={!!err.phone} aria-describedby={err.phone ? 'e-phone' : undefined} onChange={(e) => set('phone', formatPhone(e.target.value))} />
                    {err.phone && <span className="err" id="e-phone">{err.phone}</span>}
                  </div>
                  <div className="fld">
                    <label htmlFor="f-email">{BOOKING.contact.email}</label>
                    <input id="f-email" type="email" autoComplete="email" value={f.email} aria-invalid={!!err.email} aria-describedby={err.email ? 'e-email' : undefined} onChange={(e) => set('email', e.target.value)} />
                    {err.email && <span className="err" id="e-email">{err.email}</span>}
                  </div>
                  <div className="hp" aria-hidden="true">
                    <label htmlFor="f-company">{BOOKING.honeypot}</label>
                    <input id="f-company" tabIndex={-1} autoComplete="off" value={f.company} onChange={(e) => set('company', e.target.value)} />
                  </div>
                  {err.send && <p className="err" role="alert">{err.send}</p>}
                  <div className="sh__nav">
                    <button type="button" className="sh__back" onClick={() => setStep(2)}>{BOOKING.back}</button>
                    <button type="submit" className="cta" disabled={sending} aria-busy={sending}>
                      <span>{sending ? BOOKING.sending : CTA}</span><span className="cta__w" aria-hidden="true"><WolfMark /></span>
                    </button>
                  </div>
                </form>
              )}

              {step === 4 && (
                <div className="sh__done" role="status">
                  <WolfMark />
                  <Dialog.Title className="t" render={<h2 />}>{BOOKING.done.title}</Dialog.Title>
                  <p>{BOOKING.done.body}</p>
                  <Dialog.Close className="cta cta--k">
                    <span>{BOOKING.done.back}</span><span className="cta__w" aria-hidden="true"><WolfMark /></span>
                  </Dialog.Close>
                </div>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

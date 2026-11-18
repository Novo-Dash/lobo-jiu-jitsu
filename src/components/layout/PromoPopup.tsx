import { useEffect, useRef, useState } from 'react'
import { PROMO } from '../../data/promo'
import { usePromo } from '../../lib/promo'
import { useBooking } from '../../nd'
import { Cta } from '../ui/Cta'
import { Icon } from '../ui/Icon'
import { Photo } from '../ui/Photo'

const SEEN = 'lobo-bn-popup'

/**
 * Black November pop-up (Jonathan, 18/11): Lobo's own campaign art in a native modal dialog, with the
 * booking button under it. Once per visit (session), when the visitor scrolls past the hero or after
 * 12 s, never while the booking form is open, and gone with the rest of the promo on December 1.
 * The booking button closes it first: the kit's form is not in the top layer and would open behind it.
 */
export function PromoPopup() {
  const promo = usePromo()
  const { isOpen: booking } = useBooking()
  const ref = useRef<HTMLDialogElement>(null)
  const [due, setDue] = useState(false)
  const shown = useRef(false)

  useEffect(() => {
    if (!promo) return
    try { if (sessionStorage.getItem(SEEN)) return } catch { /* no storage: show it */ }
    // warm the art up so the dialog opens on a painted picture (lazy in a closed dialog = blank)
    const warm = setTimeout(() => { const i = new Image(); i.sizes = '(max-width: 520px) 92vw, 460px'; i.srcset = `${PROMO.art.src.replace(/\.webp$/, '-sm.webp')} ${PROMO.art.sm}w, ${PROMO.art.src} ${PROMO.art.w}w` }, 1500)
    const go = () => setDue(true)
    const t = setTimeout(go, 12000)
    const onScroll = () => { if (scrollY > innerHeight * 0.8) go() }
    addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(warm); clearTimeout(t); removeEventListener('scroll', onScroll) }
  }, [promo])

  useEffect(() => {
    const d = ref.current
    if (!due || !d || shown.current || booking) return
    shown.current = true
    try { sessionStorage.setItem(SEEN, '1') } catch { /* fine */ }
    d.showModal()
    window.__lenis?.stop()
  }, [due, booking])

  if (!promo) return null
  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      className="bn-pop"
      aria-label={PROMO.popup.label}
      onClose={() => window.__lenis?.start()}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="bn-pop__card">
        <button type="button" className="bn-pop__x" aria-label={PROMO.popup.close} onClick={close}><Icon name="close" /></button>
        <Photo photo={PROMO.art} sizes="(max-width: 520px) 92vw, 460px" />
        <div className="bn-pop__go" onClickCapture={close}>
          <Cta tone="r" />
        </div>
      </div>
    </dialog>
  )
}

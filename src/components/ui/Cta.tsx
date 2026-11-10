import type { BookingIntent } from '../../types'
import { CTA } from '../../data/site'
import { cn } from '../../lib/utils'
import { track } from '../../lib/track'
import { useBooking } from '../../booking/BookingContext'
import { WolfMark } from './WolfMark'

type Props = BookingIntent & { tone?: 'y' | 'k' | 'r'; size?: 'md' | 'sm'; className?: string; id?: string; label?: string }

/**
 * The one CTA (PRD 8.9): yellow pill (black, tone k; red, tone r), Inter 700, and the wolf in a circle on the
 * right. Hover: the wolf lifts its head (rotate 14° → -6°, spring). Opens the booking with what the
 * click already knows (who, class, day, time).
 */
export function Cta({ tone = 'y', size = 'md', className, id, label = CTA, ...intent }: Props) {
  const { open } = useBooking()
  return (
    <button
      type="button"
      id={id}
      className={cn('cta', tone === 'k' && 'cta--k', tone === 'r' && 'cta--r', size === 'sm' && 'cta--sm', className)}
      onClick={() => { track.cta(intent.source, { who: intent.who, program: intent.program }); open(intent) }}
    >
      <span>{label}</span>
      <span className="cta__w" aria-hidden="true"><WolfMark /></span>
    </button>
  )
}

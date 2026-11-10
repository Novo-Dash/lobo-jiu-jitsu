import type { MouseEvent } from 'react'
import type { Who } from '../../types'
import { CTA } from '../../data/site'
import { audienceOf } from '../../lib/audience'
import { useBooking } from '../../nd'
import { cn } from '../../lib/utils'
import { WolfMark } from './WolfMark'

type Props = { tone?: 'y' | 'k' | 'r'; size?: 'md' | 'sm'; className?: string; id?: string; label?: string; who?: Who }

/**
 * The one CTA (PRD 8.9): yellow pill (black, tone k; red, tone r), Inter 700, and the wolf in a circle
 * on the right. Hover: the wolf lifts its head. A link to #book: the Novo Dash kit opens its booking
 * form (src/nd). With `who`, the form opens on that audience's classes.
 */
export function Cta({ tone = 'y', size = 'md', className, id, label = CTA, who }: Props) {
  const { open } = useBooking()
  const audience = audienceOf(who)
  const onClick = audience ? (e: MouseEvent) => { e.preventDefault(); open({ audience }) } : undefined
  return (
    <a href="#book" id={id} className={cn('cta', tone === 'k' && 'cta--k', tone === 'r' && 'cta--r', size === 'sm' && 'cta--sm', className)} onClick={onClick}>
      <span>{label}</span>
      <span className="cta__w" aria-hidden="true"><WolfMark /></span>
    </a>
  )
}

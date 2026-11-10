import { Fragment } from 'react'
import type { Rich as RichText } from '../../types'

/** Renders the `**bold**` runs of the copy in src/data as <b>. */
export function Rich({ text }: { text: RichText }) {
  return <>{text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>))}</>
}

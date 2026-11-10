import type { ReactNode } from 'react'
import type { Title } from '../../types'

/** The title device (PRD 8.6): the last part on a tight yellow band, not a full block. */
function Highlight({ children }: { children: ReactNode }) {
  return <span className="y">{children}</span>
}

/** A section title from data: plain part + highlighted part. */
export function TitleText({ title }: { title: Title }) {
  return <>{title.a}<Highlight>{title.b}</Highlight></>
}

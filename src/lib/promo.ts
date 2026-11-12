import { useEffect, useState } from 'react'
import { PROMO } from '../data/promo'

declare const __BUILT__: number

// What the prerendered HTML holds: the promo is on if the page was built before it ended. The client
// starts from the same answer (no hydration mismatch), then drops it once the real clock is past the end,
// so a page built in November and still served in December hides it without a new deploy.
const BUILT_ON = __BUILT__ < PROMO.end

export function usePromo() {
  const [on, setOn] = useState(BUILT_ON)
  useEffect(() => { if (Date.now() >= PROMO.end) setOn(false) }, [])
  return on
}

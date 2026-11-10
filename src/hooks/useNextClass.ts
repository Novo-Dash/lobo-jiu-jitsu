import { useEffect, useState } from 'react'
import { classesOn, fmtShort } from '../data/schedule'
import { DAY_LONG } from '../data/schedule'
import { FOOTER } from '../data/footer'
import { auroraNow, nextDays } from '../lib/time'

/** "Next class: Little Lobos, today at 4:40 pm" + the Aurora clock, from data/schedule.ts. Client only. */
export function useNextClass() {
  const [state, setState] = useState<{ label: string; clock: string } | null>(null)
  useEffect(() => {
    const tick = () => {
      let now
      try { now = auroraNow() } catch { return }
      let label = ''
      nextDays(now.day).some((d, k) => {
        // the 6:50 pm Juniors and Adults share one line, like the prototype
        const list = classesOn(d).filter((c) => k > 0 || c.start > now.minutes)
        if (!list.length) return false
        const first = list[0], same = list.filter((c) => c.start === first.start).map((c) => c.program)
        const when = k === 0 ? FOOTER.today : k === 1 ? FOOTER.tomorrow : DAY_LONG[d]
        label = FOOTER.next([...new Set(same)].join(' & '), when, fmtShort(first.start))
        return true
      })
      setState({ label, clock: `${FOOTER.clockPrefix} ${now.hhmm}` })
    }
    tick()
    const id = setInterval(tick, 20000)
    return () => clearInterval(id)
  }, [])
  return state
}

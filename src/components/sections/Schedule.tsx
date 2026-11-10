import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { CLASSES, classesOn, DAY_LONG, DAYS, fmtRow, ROWS, SCHEDULE, type ClassSlot } from '../../data/schedule'
import type { Day } from '../../types'
import { lines, useGSAP } from '../../lib/gsap'
import { motionOK } from '../../lib/motion'
import { auroraNow, dateOf } from '../../lib/time'
import { audienceOf } from '../../lib/audience'
import { useBooking } from '../../nd'
import { Cta } from '../ui/Cta'
import { TitleText } from '../ui/Highlight'

type Filter = (typeof SCHEDULE.filters)[number]['key']

/**
 * 09 · "What time?" The wall board: a text table, black header with the days in yellow, the date
 * under each; today (Aurora time) gets the yellow "Today" tag on the same line as the day, no fill on
 * the column. Sunday: hatched, "No classes" centred in a white pill. Every class is the button that
 * books it. Phones: day tabs + list. Today and the dates are decided after mount (prerender-safe).
 */
export function Schedule() {
  const root = useRef<HTMLElement>(null)
  const { open } = useBooking()
  const [filter, setFilter] = useState<Filter>('all')
  const [now, setNow] = useState<{ today: Day; local: Date } | null>(null)
  const [day, setDay] = useState<Day>('Mon')

  useEffect(() => {
    try { const n = auroraNow(); setNow({ today: n.day, local: n.local }); setDay(n.day === 'Sun' ? 'Mon' : n.day) } catch { /* no Intl time zones: no Today tag */ }
  }, [])
  useGSAP(() => { if (motionOK()) lines(root.current!.querySelector('h2')!) }, { scope: root })

  const today = now?.today
  // a class opens the kit's form on that class's audience (its live list has the real times)
  const book = (c: ClassSlot) => open({ audience: audienceOf(c.who) })
  const shown = (c: ClassSlot) => filter === 'all' || c.kind === filter
  const list = classesOn(day).filter(shown)

  const onTabKey = (e: KeyboardEvent) => {
    const i = DAYS.indexOf(day), n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!n) return
    e.preventDefault()
    const next = DAYS[(i + n + DAYS.length) % DAYS.length]
    setDay(next)
    root.current?.querySelector<HTMLElement>(`#tab-${next}`)?.focus()
  }

  return (
    <section className="sec wt fit" id="schedule" aria-labelledby="sc-h" ref={root}>
      <div className="shell">
        <div className="sch__head">
          <div>
            <h2 className="t t-1" id="sc-h"><TitleText title={SCHEDULE.title} /></h2>
            <p className="small sch__note">{SCHEDULE.note}</p>
          </div>
          <div className="filters" role="group" aria-label={SCHEDULE.filtersLabel}>
            {SCHEDULE.filters.map((f) => <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</button>)}
          </div>
        </div>

        <div className="board">
          <table>
            <caption className="sr">{SCHEDULE.caption}</caption>
            <thead>
              <tr>
                <th scope="col">{SCHEDULE.timeCol}</th>
                {DAYS.map((d) => (
                  <th scope="col" key={d} className={d === today ? 'today' : undefined} aria-label={DAY_LONG[d]}>
                    <b>{d}</b><small>{d === today ? SCHEDULE.today : now ? dateOf(d, now.today, now.local) : ' '}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((t, r) => (
                <tr key={t}>
                  <th scope="row">{fmtRow(t)}</th>
                  {DAYS.map((d) => {
                    if (d === 'Sun') return r ? null : <td key={d} className="none" rowSpan={ROWS.length}><span>{SCHEDULE.noClasses}</span></td>
                    return (
                      <td key={d} className={d === today ? 'today' : undefined}>
                        {CLASSES.filter((c) => c.start === t && c.days.includes(d)).map((c) => (
                          <button key={c.program} type="button" className={`cls${shown(c) ? '' : ' dim'}`} data-k={c.kind} tabIndex={shown(c) ? undefined : -1} aria-hidden={shown(c) ? undefined : true} onClick={() => book(c)}>
                            <b>{c.program}</b><small>{c.sub}</small>
                          </button>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="daytabs" role="tablist" aria-label={SCHEDULE.daysLabel} onKeyDown={onTabKey}>
          {DAYS.map((d) => (
            <button key={d} id={`tab-${d}`} type="button" role="tab" aria-selected={d === day} aria-controls="dayslots" tabIndex={d === day ? 0 : -1} className={d === today ? 'today' : undefined} onClick={() => setDay(d)}>{d}</button>
          ))}
        </div>
        <div role="tabpanel" id="dayslots" aria-labelledby={`tab-${day}`}>
        <ul className="dayslots">
          {list.length ? list.map((c) => (
            <li key={c.program + c.start}>
              <button type="button" data-k={c.kind} onClick={() => book(c)}>
                <time>{fmtRow(c.start)}</time>
                <span><b>{c.program}</b><small>{c.sub}</small></span>
                <span className="go">{SCHEDULE.book}</span>
              </button>
            </li>
          )) : <li className="dayslots__none">{SCHEDULE.noClassesOn(DAY_LONG[day])}</li>}
        </ul>
        </div>

        <div className="sch__foot">
          <span><b>{SCHEDULE.foot.lead}</b>{SCHEDULE.foot.rest}</span>
          <Cta size="sm" />
        </div>
      </div>
    </section>
  )
}

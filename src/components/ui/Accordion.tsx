import { Accordion as Base } from '@base-ui/react/accordion'

type Item = { q: string; a: string }

/**
 * Lobo's accordion on Base UI's unstyled primitive (aria-expanded, keyboard, height var):
 * white card, 1px border, radius 18; open = yellow, the + in a circle turns 45° (PRD 8.9).
 * One open at a time; the height eases through --accordion-panel-height (app.css).
 */
export function Accordion({ items }: { items: Item[] }) {
  return (
    <Base.Root className="faq__list" multiple={false}>
      {items.map((it) => (
        <Base.Item key={it.q} className="qa" value={it.q}>
          <Base.Header render={<h3 />}>
            <Base.Trigger className="qa__q">{it.q}<span className="pm" aria-hidden="true" /></Base.Trigger>
          </Base.Header>
          <Base.Panel className="qa__a"><p>{it.a}</p></Base.Panel>
        </Base.Item>
      ))}
    </Base.Root>
  )
}

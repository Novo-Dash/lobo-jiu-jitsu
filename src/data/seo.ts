import { CLASSES, fmtShort } from './schedule'
import { SITE } from './site'
import { FAQ } from './faq'
import { PRICING } from './pricing'

declare const __SITE__: string
declare const __PREVIEW__: boolean

export const SEO = {
  site: __SITE__,
  preview: __PREVIEW__,
  title: 'Lobo Jiu-Jitsu | Brazilian Jiu-Jitsu for Kids, Teens and Adults in Aurora, IL',
  description: 'Brazilian Jiu-Jitsu in Aurora, Illinois. Classes for kids from age 4, teens and adults, taught by Professor Fred Lobo, a 3rd-degree black belt. Book your free trial class.',
  // link previews: ≤ 60 / ≤ 155 characters (the <title> and meta description stay as the PRD wrote them)
  ogTitle: 'Lobo Jiu-Jitsu | Brazilian Jiu-Jitsu in Aurora, IL',
  ogDescription: 'BJJ for kids from age 4, teens and adults in Aurora, IL, taught by Professor Fred Lobo, a 3rd-degree black belt. Your first class is free.',
  ogAlt: 'A class at Lobo Jiu-Jitsu in Aurora, IL, with the Lobo logo. First class free.',
  modified: '2026-11-10',
}

const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
const DAY_URL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' } as const

/** SportsActivityLocation (PRD 19): opening hours from data/schedule.ts (first class to last class each day). */
export function jsonLd() {
  const byDay = new Map<string, { open: number; close: number }>()
  for (const c of CLASSES) for (const d of c.days) {
    const cur = byDay.get(d), end = c.end ?? c.start + 60
    byDay.set(d, { open: Math.min(cur?.open ?? 1e9, c.start), close: Math.max(cur?.close ?? 0, end) })
  }
  const a = SITE.address
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SportsActivityLocation',
        '@id': `${SEO.site}/#school`,
        name: SITE.name,
        alternateName: SITE.legalName,
        url: `${SEO.site}/`,
        image: `${SEO.site}/og-image.jpg`,
        logo: `${SEO.site}${SITE.logo.src}`,
        description: SEO.description,
        telephone: SITE.phone.e164,
        email: SITE.email,
        address: { '@type': 'PostalAddress', streetAddress: a.street, addressLocality: a.city, addressRegion: a.state, postalCode: a.zip, addressCountry: a.country },
        areaServed: ['Aurora, IL', 'Naperville, IL'],
        sport: 'Brazilian Jiu-Jitsu',
        knowsAbout: ['Brazilian Jiu-Jitsu', 'Kids Jiu-Jitsu (ages 4–7 and 8–11)', 'Teen Jiu-Jitsu (ages 12–15)', 'Adult Jiu-Jitsu (16+)', 'Self-defense', 'Private lessons'],
        foundingDate: '2023-10',
        dateModified: SEO.modified,
        priceRange: '$$',
        sameAs: [SITE.social.instagram.url, SITE.social.facebook.url],
        openingHoursSpecification: [...byDay].map(([d, h]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${DAY_URL[d as keyof typeof DAY_URL]}`, opens: hhmm(h.open), closes: hhmm(h.close) })),
        founder: { '@id': `${SEO.site}/#fred` },
        employee: { '@id': `${SEO.site}/#fred` },
        makesOffer: PRICING.plans.map((p) => ({ '@type': 'Offer', name: p.name, price: p.price.replace('$', ''), priceCurrency: 'USD' })),
      },
      { '@type': 'Person', '@id': `${SEO.site}/#fred`, name: 'Fred Lobo', jobTitle: 'Head professor, 3rd-degree black belt', worksFor: { '@id': `${SEO.site}/#school` } },
      { '@type': 'FAQPage', mainEntity: FAQ.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  }
}

/** llms.txt: the school in plain text for AI search. */
export function llms() {
  const a = SITE.address
  const week = CLASSES.map((c) => `- ${c.program}: ${c.days.join(', ')} at ${fmtShort(c.start)}${c.end ? `–${fmtShort(c.end)}` : ''}`).join('\n')
  return `# ${SITE.name}\n\n> ${SEO.description}\n\n- Address: ${a.street}, ${a.city}, ${a.state} ${a.zip}\n- Phone: ${SITE.phone.display}\n- Email: ${SITE.email}\n- Head professor: Fred Lobo, 3rd-degree black belt from Belo Horizonte, Brazil. Opened in October 2023.\n- First class: free trial class.\n\n## Weekly schedule (Aurora time)\n${week}\n\n## Plans\n${PRICING.plans.map((p) => `- ${p.name}: ${p.price}${p.perLong}`).join('\n')}\n\n## FAQ\n${FAQ.items.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}\n`
}

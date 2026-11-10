import { img } from './img'

export const SITE = {
  name: 'Lobo Jiu-Jitsu',
  legalName: 'Fred Lobo BJJ',
  phone: { display: '(331) 229-9993', tel: 'tel:+13312299993', e164: '+13312299993' },
  email: 'info@lobobjj.com',
  address: {
    street: '646 S Frontenac St, Suite 109',
    city: 'Aurora',
    state: 'IL',
    stateLong: 'Illinois',
    zip: '60504',
    country: 'US',
    // geo fica fora do JSON-LD até vir do Google Business Profile: [CONFIRMAR coordenadas]
  },
  timeZone: 'America/Chicago',
  maps: {
    directions: 'https://www.google.com/maps/dir/?api=1&destination=646+S+Frontenac+St+Suite+109+Aurora+IL+60504',
    // the redirect target of ?q=&output=embed (that one answers with X-Frame-Options and paints blank)
    embed: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s646+S+Frontenac+St+Suite+109+Aurora+IL+60504!6i16',
  },
  social: {
    instagram: { url: 'https://www.instagram.com/lobojiujitsuu', handle: '@lobojiujitsuu', label: 'Instagram' },
    facebook: { url: 'https://www.facebook.com/TeamLoboJiuJitsu/', label: 'Facebook' },
  },
  logo: img('logo', 'Lobo Jiu-Jitsu', 'png'),
  logoBlack: img('logo_black', 'Lobo Jiu-Jitsu', 'png'),
} as const

/** The one CTA of the page (PRD 10, 17). */
export const CTA = 'Book Your Free Trial Class'

export const NAV = {
  skip: 'Skip to main content',
  homeLabel: 'Lobo Jiu-Jitsu, back to top',
  sectionsLabel: 'Sections',
  links: [
    { href: '#programs', label: 'Programs' },
    { href: '#professor', label: 'Professor' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ],
  telLabel: 'Call Lobo Jiu-Jitsu at (331) 229-9993',
} as const

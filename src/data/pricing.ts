import type { Title } from '../types'

export const PRICING = {
  tag: 'Investment',
  title: { a: 'Clear numbers ', b: 'before you enroll' } satisfies Title,
  plansLabel: 'Plans',
  // [CONFIRMAR todos os valores com o cliente; Kids Unlimited cobre as 3 turmas?]
  plans: [
    { name: 'Kids Unlimited', note: 'Little Lobos, Kids, Juniors', price: '$159', per: '/mo', perLong: '/month' },
    { name: 'Adult Unlimited', note: 'Every adult class', price: '$159', per: '/mo', perLong: '/month' },
    { name: 'Second adult', note: 'Same family', price: '$99.99', per: '/mo', perLong: '/month' },
    { name: 'Private lessons', note: 'By appointment', price: '$125', per: '/hr', perLong: '/hour' },
  ],
  // [CONFIRMAR taxa de matrícula, uniforme, desconto à vista, contrato/cancelamento]
  note: 'Prepay discount plans available. We explain costs and terms clearly before you enroll, so nothing is a surprise.',
  cardFoot: 'Member · Aurora, IL',
}

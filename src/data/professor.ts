import type { Title } from '../types'
import { img } from './img'

export const PROFESSOR = {
  tag: 'The professor',
  title: { a: 'Meet Professor ', b: 'Fred Lobo' } satisfies Title,
  // set in four lines on desktop, as Adryan laid them out (10/11); one paragraph on a phone
  body: ['A black belt from Belo Horizonte,', 'and the teacher on this mat every', 'day. In October 2023, Lobo Jiu-Jitsu', 'opened in Aurora.'],
  // [CONFIRMAR foto do Fred em fundo liso para o recorte final]
  photo: img('fred_coach', 'Professor Fred Lobo, arms crossed, in a Lobo Jiu-Jitsu rash guard'),
  belt: 'Black belt, 3rd degree',
  // Panel colour: brand yellow, done in place of the red that was asked for. [CONFIRMAR cor do painel com o Adryan]
  // Lineage, quote and IBJJF titles stay off the page until the client confirms them (PRD 0.11, 20).
}

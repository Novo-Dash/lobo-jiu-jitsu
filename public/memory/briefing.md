# Briefing · Lobo Jiu-Jitsu (PRD LOBO-001)

## Cliente
- **Lobo Jiu-Jitsu** · 646 S Frontenac St, Suite 109, Aurora, IL 60504
- Registrada no IBJJF como **Fred Lobo BJJ**
- Head professor: **Fred Lobo**, faixa preta 3º grau, de Belo Horizonte. Academia aberta em out/2023.
- Telefone (331) 229-9993 · info@lobobjj.com · IG @lobojiujitsuu · FB TeamLoboJiuJitsu
- Posicionamento: academia **independente** (não é franquia nem afiliada). Copy em inglês americano.

## Fontes desta LP
- PRD: `prd-LOBO-001.md` (raiz) · prompt: `prompt-claude-code-LOBO.md`
- Protótipo aprovado (fonte da verdade visual): `reference/prototipo-aprovado-LOBO.html`
- Footer: `reference/anexo-footer-LOBO.md`
- **Copy do gestor (`lobo-jiu-jitsu-lp-copy.md`): NÃO estava em nenhuma pasta desta máquina.** A copy da página foi tirada,
  palavra por palavra, do protótipo aprovado (que já é a copy do gestor depois das rodadas com o Adryan). `[CONFIRMAR: mandar o arquivo para conferir]`

## Grade (src/data/schedule.ts, fonte única)
| Turma | Idades | Dias e horários |
|---|---|---|
| Little Lobos | 4–7 | Mon–Fri, 4:40–5:30 pm `[CONFIRMAR dias]` |
| Kids | 8–11 | Mon–Fri, 5:40–6:40 pm |
| Juniors | 12–15 | Mon–Thu, 6:50 pm `[CONFIRMAR término]` |
| Adults | 16+ | Mon & Thu 7:00–8:00 am · Mon–Thu 12:00–1:00 pm · Mon–Thu 6:50–8:10 pm · Sat 11:00 am–12:20 pm |

## Preços publicados (src/data/pricing.ts, todos `[CONFIRMAR]`)
Kids Unlimited $159/mo · Adult Unlimited $159/mo · Second adult $99.99/mo · Private lessons $125/hr.

## Pendências (PRD §20), estado em 10/11/2026
| Item | Status | Onde está no código |
|---|---|---|
| Dias do Little Lobos | 🔴 | `data/schedule.ts`, `data/programs.ts` |
| Término do Juniors | 🔴 | `data/schedule.ts` (end: null), `data/programs.ts` |
| Preços + Kids Unlimited cobre as 3 turmas? | 🔴 | `data/pricing.ts` |
| Matrícula, uniforme, desconto à vista, contrato | 🔴 | `data/pricing.ts` (nota) |
| 3–5 reviews reais + nota/contagem do Google | 🔴 | `data/reviews.ts` (2 reais + 3 placeholders visíveis) |
| Webhook GHL, IDs Pixel/GA4, token CAPI | 🔴 | env vars (`.env.example`) |
| Permissão escrita para fotos de crianças | 🔴 | todas as fotos de kids |
| Telefone aceita SMS? ("Call or text") | 🟡 | `data/location.ts`, footer |
| Cor do painel do Professor (amarelo feito × vermelho pedido) | 🟡 | `data/professor.ts`, `.pf__panel` |
| Corte do FAQ de 12 para 6 | 🟡 | `data/faq.ts` |
| Exceção do orçamento de pin (0.13) | 🟡 | `design-decisions.md` |
| Logo em SVG | 🟡 | `ui/WolfMark.tsx` (silhueta vetorizada) + PNGs |
| Fotos originais, Fred em fundo liso, fachada maior | 🟡 | `public/images` |
| Wording "wheelchair-accessible" | 🟡 | `data/walk.ts` |
| Coordenadas exatas (geo no JSON-LD) | 🟡 | `data/site.ts` (fora do JSON-LD até confirmar) |
| Domínio final (VITE_SITE_URL) | 🟡 | até lá o build é prévia com noindex |
| Linhagem, citação do Fred, selo IBJJF | 🟡 | fora da página (PRD 0.11) |
| Política de privacidade e termos | 🟡 | ainda não há link no footer |

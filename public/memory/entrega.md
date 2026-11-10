# Entrega · Lobo Jiu-Jitsu LP (LOBO-001) · 10/11/2026

Pasta: `D:\DOCUMENTOS\NovoDash\lobo-jiu-jitsu-aurora-il` · **sem git, sem deploy, sem push** (PRD 0.12).

## O que foi construído
LP em React 19 + Vite 8 + Tailwind 4 + GSAP 3.15 + Lenis + Base UI, pré-renderizada e hidratada, replicando
`reference/prototipo-aprovado-LOBO.html` seção por seção: Nav · Hero · Programs · Parents · Adults (mensagens) ·
Professor · Why Lobo · Walk-in 3D · First class · Schedule · Pricing · Reviews · FAQ · Final CTA · Find us ·
Footer pôster rasgado (anexo) · sticky bar no celular · booking em 3 passos → `api/lead.ts` → CRM, Pixel + CAPI.

```
npm run dev        # http://localhost:5290 (o /api/lead local só registra o lead no terminal)
npm run build      # tsc + vite + SSR + prerender → dist/
npm run preview    # serve o dist/ com o mesmo /api local
node scripts/e2e.mjs <url>        # booking, UTMs, reduced motion, celular (13 checagens)
node scripts/geometry.mjs <url>   # balão × título, Walk-in no fim, pins
node scripts/shots.mjs <url> <prefixo> 1440,390   # prints no meio de cada mecanismo
node scripts/compare.mjs proto build 1440         # protótipo | build lado a lado
```

## Prints (public/memory/prints)
- `proto-<largura>-NN-*.png`: protótipo aprovado (F0) em 1440×900, 1723×953 e 390×844.
- `build-<largura>-NN-*.png`: build de produção em 1440, 1723, 390 e 2560×1080.
- `side-<largura>-NN-*.png`: **protótipo à esquerda, build à direita**, 24 pontos por largura (hero, hero abrindo,
  programs, parents, as 4 dúvidas, professor, why, 3 pontos do walk-in, os 4 passos, schedule, pricing, reviews,
  FAQ, final, find us, footer).
- Os prints `build-*` são de antes do pass do finalizador (alvos de toque e abas em 2 linhas abaixo de 380px).

## Diferenças em relação ao protótipo
Todas em `design-decisions.md §3`. As visíveis: entrada do hero em CSS; CTA do hero 24px mais alto (o protótipo
tinha um bug de transform); faixa do marca-texto justa; textos < 12px subiram para 12px; mapa real do Google
escurecido; durações das cenas presas encurtadas (0.13); no celular, alvos de toque de 44px no footer e abas de dia
em 2 linhas abaixo de 380px.

## Medições (build de produção)
| Checagem | Resultado |
|---|---|
| Lighthouse mobile (mediana de 3) | **Performance 94** (94/94/94) · Accessibility **100** · Best Practices **100** · SEO 69 só pelo `noindex` da prévia (vira 100 com `VITE_SITE_URL`) |
| Web Vitals (simulado) | LCP 2,34 s · CLS 0 · TBT 231 ms · FCP 1,04 s · peso 440 KB |
| Responsivo (finalizador, 14 viewports 320 → 3440, Chromium + WebKit) | **14/14 OK** |
| Booking + tracking (`scripts/e2e.mjs`) | 13/13: abre do hero, erros em linha, máscara de telefone, `/api/lead` 200 com who/age/experience/source/event_id, sucesso, Escape fecha, célula do schedule abre o passo 2 com a turma, UTMs + fbclid + gclid chegam no lead, zero erro no console (hidratação limpa), reduced motion em lista, barra fixa no celular, sem scroll horizontal |
| Balão × título (`scripts/geometry.mjs`) | folga mínima sob o fio do título: 1723×953 33px · 1440×900 22px · 1366×768 31px · 1280×720 13px · 2560×1080 81px · 390×844 6px |
| Walk-in no fim da cena | 0 cards visíveis em todas as larguras de desktop |
| Regras 0.4 | zero hex fora de `index.css` · zero travessão · zero Lucide/Heroicons · zero `gsap.from` · nenhum texto < 12px · todo `<img>` com width/height |
| `dist/` | 3,2 MB (fotos 2,4 MB); JS inicial 155 KB gzip, carregado depois do LCP; booking em chunk próprio (18 KB) |

## [CONFIRMAR] restantes (17 marcas em `src`: `grep -rn CONFIRMAR src`)
- **Bloqueiam publicar:** webhook do GHL (`LEAD_WEBHOOK_URL`); Pixel, GA4 e CAPI (`VITE_META_PIXEL_ID`, `VITE_GA4_ID`,
  `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`); domínio (`VITE_SITE_URL`); preços; dias do Little Lobos; término do
  Juniors; reviews reais (hoje há 3 placeholders visíveis); permissão escrita das fotos de crianças.
- **Ajustes:** cor do painel do Professor, corte do FAQ, exceção de pin (0.13), SMS no telefone, logo SVG, fotos
  originais, Fred em fundo liso, fachada maior, wording "wheelchair-accessible", coordenadas no JSON-LD, política de
  privacidade.
- **Arquivo de copy do gestor** não estava na máquina; a copy veio do protótipo.
Lista completa, com dono e lugar no código: `briefing.md`.

## Finalizador (FIM) · 10/11/2026
| | Antes (1ª medição) | Depois |
|---|---|---|
| Performance mobile | 92 | **94** (mediana de 3) |
| Accessibility | 93 | **100** |
| LCP / CLS / TBT | 2,4 s / 0 / 280 ms | 2,34 s / 0 / 231 ms |
| JS inicial (gzip) | 164 KB | 155 KB |
| Responsivo | 0/14 | **14/14** |

- **FASE 1 (dead code):** removidos `useMediaQuery`, `useReducedMotion` (o reduced motion é `html.still`, decidido
  antes do paint), `ImagePlaceholder` (nenhuma imagem pendente) e o CSS dele, 5 exports sem uso, os 3 `@fontsource`
  (só serviram para extrair os woff2) e `tailwind-merge` (`cn()` agora é `clsx`; nada para mesclar).
- **FASE 3 (.gitignore):** template da casa mesclado (dist-server, .vercel, .claude, .responsive-check). Não há git ainda.
- **FASE 4 e 5 (SEO e busca por IA):** HTML estático com o H1, as seções, FAQ, endereço e horários; OG completo com
  `og:image:secure_url`, título e descrição curtos para o preview; `og-image.jpg` 1200×630, 80 KB; JSON-LD com
  `knowsAbout`, `foundingDate`, `dateModified`, FAQPage igual ao FAQ visível; `robots.txt` libera os bots de IA;
  `llms.txt`; `public/memory` fora do `dist`.
- **FASE 2 (responsivo):** alvos de 44px no celular (logo do nav, pílulas do mapa, ícones, links e "book./call."
  do footer); abas de dia em 2 linhas abaixo de 380px; CTA mais justo abaixo de 360px; a bolha "call or text"
  aparece sempre em telas de toque.
- **FASE 6 (performance e tracking):** o mapa só carrega perto da tela; booking em chunk próprio; UTMs e click ids
  guardados na sessão e enviados com o lead; Lead com `event_id` único (Pixel + CAPI + CRM). TBT segue ~30 ms acima
  dos 200 ms da skill: é a hidratação do React mais o GSAP montando as cenas; baixar disso exigiria cortar
  movimento aprovado.

## Checklist pós-deploy (gestor)
- [ ] Na Vercel: `VITE_SITE_URL`, `LEAD_WEBHOOK_URL`, `GHL_LOCATION_ID`, `VITE_META_PIXEL_ID` = `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `VITE_GA4_ID` (ver `.env.example`). Sem `VITE_SITE_URL` a página sai com `noindex`.
- [ ] Testar o form de verdade antes: com `LEAD_WEBHOOK_URL` vazio a API responde 503 e o visitante vê "call (331) 229-9993".
- [ ] `curl -s -A "WhatsApp/2.23" https://DOMINIO/ | grep -i "og:"` e o mesmo com `Slackbot-LinkExpanding 1.0`.
- [ ] `curl -sI https://DOMINIO/og-image.jpg` → 200, `image/jpeg`, ≤ 300 KB, sem redirect.
- [ ] Facebook Sharing Debugger, LinkedIn Post Inspector, opengraph.xyz; colar o link no Slack e no WhatsApp.
- [ ] `curl -s https://DOMINIO/ | grep -i "<h1"` em produção.
- [ ] `curl -sIL https://DOMINIO/ | grep -i content-security-policy`, e no console do site zero "Refused to load".
- [ ] Hospedagem não bloqueia bots de IA (firewall da Vercel).
- [ ] validator.schema.org e Rich Results Test.
- [ ] Sitemap no Search Console e no Bing Webmaster Tools.
- [ ] Google Business Profile: NAP idêntico ao da página; colocar o link do GBP no `sameAs` (`data/seo.ts`).
- [ ] PageSpeed Insights mobile na URL de produção.
- [ ] No máximo 1 redirect na URL do anúncio.
- [ ] Abrir a URL do anúncio com UTMs, enviar o form e confirmar o lead no GHL com a origem e uma única conversão (Pixel + CAPI deduplicados no Events Manager).
- [ ] Baseline de IA: "best jiu-jitsu gym in Aurora IL" e "Lobo Jiu-Jitsu" no ChatGPT, Gemini e Perplexity; repetir em 30 dias.

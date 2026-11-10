# Design decisions · Lobo Jiu-Jitsu (LOBO-001)

## 1. A espinha herdada e o que é da Lobo
O protótipo aprovado já é a síntese das referências da PRD 0.9; o código React o replica, seção por seção.

| Vem de | O quê | Onde |
|---|---|---|
| Satori | a cena de mensagens (dúvida → digitando → resposta, uma por vez, presa) | `sections/Adults.tsx` |
| Fight Sports | display condensada em caixa alta, título bicolor | `.t`, Saira 50/900 |
| Ninety5 | hero em card que abre no scroll; régua de programas | `Hero.tsx`, `Programs.tsx` |
| Maison / OCJ | vocabulário de movimento (máscara de linha, um mecanismo por seção), Lenis no ticker do GSAP | `lib/gsap.ts`, `lib/lenis.ts` |
| OCJ | `api/capi.ts` (CAPI com event_id), CSP do `vercel.json` | `api/`, `vercel.json` |
| Gonzales | prerender + hydrate, bundle depois do LCP apresentado, CSS inline | `scripts/prerender.mjs`, `main.tsx` |
| **Lobo** | o lobo facetado (CTA que levanta a cabeça, patch da mochila, avatar, pin do mapa, cartão de membro, padrão do fundo), o amarelo #FAC002 do Instagram como objeto físico (fita métrica, post-it, folha, pin, card), a mochila no azul do tatame, a faixa branca que ganha graus, o pôster rasgado | toda a página |

Abertos nesta sessão: o protótipo inteiro (HTML, CSS, JS), OCJ (`api/capi.ts`, `vercel.json`) e Gonzales (`scripts/prerender.mjs`, `main.tsx`, `entry-server.tsx`). Maison, Satori, Fight Sports e Ninety5 **não** foram reabertos: o que a Lobo herda deles já está no protótipo, e é ele que se replica (PRD 0.9.3).

## 2. Exceção declarada: orçamento de scroll preso (PRD 0.13) `[CONFIRMAR com o Adryan]`
A regra da casa é ≤ 3,5 telas presas e ≤ 30% da página. A Lobo tem três cenas presas:

| Cena | Protótipo | No código |
|---|---|---|
| Adults (mensagens) | 4,6 telas | **3,2 telas** (`.dq` height 3.2 × 100svh, 0,8 por dúvida) |
| Walk-in (profundidade) | ~4,4 telas | **2,4 telas** (`end: +=2.4 × innerHeight`, GAP 470) |
| Primeira aula | 2,4 telas | **1,8 telas** (`end: +=180%`) |

Soma 7,4 telas, acima da regra. Mitigação: cada cena termina com CTA visível (Adults: CTA da 4ª dúvida; Walk-in: a barra fixa no celular e o CTA da primeira aula logo depois; Primeira aula: CTA dentro do card) e nenhum trecho passa de 2,5 telas sem CTA. Com reduced motion não há pin nenhum.

## 3. Onde o código difere do protótipo (e por quê)
1. **Entrada do hero em CSS, não `lines()` no H1.** Com prerender, o H1 já está pintado antes do bundle; um SplitText na hidratação esconderia o título e o faria subir de novo (piscada), e o PRD proíbe H1/CTA com opacity 0 esperando JS. A entrada roda do primeiro paint: o H1 sobe de uma máscara (clip-path), sub e CTA sobem, a foto assenta de 1,16 para 1 num wrapper (`.hero__media`), e o scrub do scroll fica no `<img>`. Os H2 usam `lines()`.
2. **CTA do hero 24px mais alto que no print do protótipo.** No protótipo o `gsap.from` do botão briga com o `transition: transform` do `.cta` e ele para 24px abaixo da própria caixa (vazando o padding do card). O build segue o CSS do protótipo (30px abaixo do sub).
3. **Faixa do marca-texto justa (25–79%).** No protótipo a máscara do SplitText cortava a faixa de 8–88% até a altura da linha. A máscara agora tem folga para acento (PRD 0.4.2(2)), então a própria faixa é justa: mesmo visual, com ou sem split.
4. **Textos de 10–11,5px subiram para 12px** (PRD 0.4.2(9)): meta do balão, datas do quadro, "No classes", pílulas da primeira aula no celular, placa do Fred no celular, toast/bolha/crédito do footer.
5. **Saira cortada em uma instância (wdth 50, wght 900, 13 KB)** com fontTools; Inter variável 400–700 (36 KB). `font-display: block` + preload em Saira e Inter (não `swap` como diz a PRD 9): medido na casa, `swap` com display condensada dá CLS ou pinta a página na fallback larga. Permanent Marker fica em `swap`.
6. **Cores dos SVG por token.** Gradientes da mochila, do mapa desenhado, do pin e das abas do footer leem `var(--color-…)`; as misturas que o protótipo fazia em JS (`mixHex`) viraram `color-mix()` em `app.css`. Tailwind com `@theme static` para emitir todos os tokens (sem isso a mochila saía preta: os nomes são montados em runtime).
7. **Booking no Base UI Dialog** (foco preso, página inert, Escape, trava de scroll) com a pele do protótipo; erros em linha por campo; quem chega com "quem treina" já preenchido começa no passo 2 sem o "Back" para o passo 1. O avatar do topo (`.sh__av`) ganhou estilo: no protótipo o SVG não tinha tamanho.
8. **FAQ no Base UI Accordion**: um aberto por vez, altura animada por `--accordion-panel-height`; sem numeração.
9. **Walk-in: só uma versão existe por vez** (3D no desktop, trilho no celular, `display:none` na outra), para não ter texto real dentro de `aria-hidden`. Com reduced motion o desktop também mostra o trilho (no protótipo o palco ficava vazio).
10. **Mapa real do Google** (embed sem chave, URL `/maps/embed?origin=mfe&pb=`, a antiga dá X-Frame-Options), escurecido por filtro; o mapa desenhado do protótipo fica embaixo como fallback; o pin do lobo vai para o centro (onde o embed põe o endereço). Carrega só perto da tela.
11. **Cartão de membro** é `role="img"` com `aria-label` (plano e preço) em vez de `aria-hidden`, para não esconder texto real.
12. **Quadro de horários:** a coluna de hora é `<th scope="row">`; Today e as datas são decididos depois da hidratação (o HTML pré-renderizado não tem dia).
13. **Footer:** os estados "montando do nada" só existem com a classe `.armed` (colocada pelo script); sem JS ou com reduced motion o footer aparece montado. "book." é um botão (abre o booking). Pin = `<button>` com label, SVG do rasgo `aria-hidden`, toast `role=status`.
14. **Padrão do lobo** continua como `::before` com `background-attachment: fixed` (CSS do protótipo); não virou componente `WolfPattern.tsx` (seria código morto).
15. **CTA é `<button>`**, não `<a href="#book">`: ele abre um diálogo, não navega.
16. **Fotos dos cards de programa com `alt=""`**: estão dentro do botão que já diz turma, idade e horário.
17. **Tracking:** Pixel e GA4 só entram no `<head>` quando `VITE_META_PIXEL_ID` / `VITE_GA4_ID` existem; Lead com `event_id` igual no Pixel, na CAPI e no payload do CRM.
18. **`public/memory` sai do `dist`** no prerender: briefing e prints são do projeto, não do site.
19. **Copy:** o arquivo do gestor não estava na máquina; a copy veio literal do protótipo aprovado (PRD > protótipo > memória).

## 4. Pedidos do Adryan não cobertos pela PRD
Nenhum ficou de fora: a lista do prompt (§2) foi conferida item por item contra o build (ver `entrega.md`, checklist).

## 5. Cor do painel do Professor `[CONFIRMAR]`
Pedido: "background vermelho". Feito no amarelo da marca (a Lobo não tem vermelho). O vermelho que existe na página é só a barra da faixa preta (é a cor real da faixa).

## Ajustes do Adryan · 10/11/2026 (depois do FIM)
- Professor: "Fred Lobo" em linha própria numa caixa amarela (letra preta); faixa preta de 3 graus logo abaixo do título; CTA amarelo; lobo 100% preto e inteiro dentro do painel (painel subiu de 64% para 74% da cena para o lobo aparecer em volta dele); plaquinha com nome e cargo removida (o cargo segue como aria-label da faixa).
- Schedule: linha de cabeçalho (Time + dias) amarela com letra preta; o selo "Today" virou preto.
- Reviews: o card ativo ficou preto, só a caixa das aspas amarela.
- Find us: título e linha centralizados, um embaixo do outro; o mapa do Google virou o fundo da seção (como o footer do CG North Lakeland): sobe do ink no topo, desce para o tom do footer (`--color-sheet`, medido no print: rgb 27) com o mesmo grão de papel, sem emenda; pino do lobo onde o Google põe o marcador (centro do iframe, cortado 160px em cima para esconder o card de lugar). Em cima do mapa: a fachada à esquerda e um card só com endereço, rotas, ligar e os contatos à direita, no ink do footer. No celular o mapa é uma faixa sob o título e os cards vêm depois. O card flutuante do mapa saiu.
- Footer no celular: pílula "Next class" com 46px de alvo (ficava em 43,9px no iPhone SE conforme o texto do dia).
- Nav: pega a cor da seção embaixo dela; preta sobre as escuras (`data-nav="dark"`: hero, final CTA, find us, footer), branca com logo preto sobre as brancas. Lida no meio da pílula a cada frame com scroll; o HTML pré-renderizado começa preto (é o que está sob ela no topo).
- First class: a sombra do card do passo era cortada pelo `overflow:clip` da seção e coberta pelo Schedule; agora só corta na horizontal e a seção pinta por cima da seguinte (`z-index:1`).
- Pricing: sombra do cartão mais suave (0 34px 60px -34px a 45% + uma curta a 25%, no lugar de 0 50px 90px -40px a 95%).
- Final CTA: a foto desce para o ink no pé (`var(--k)` em 100%), igual ao topo do Find us, sem emenda; enquadrada mais baixo (`object-position 50% 82%`), quase sem teto.
- Hero ↔ Final CTA: as fotos trocaram (hero = foto do time, `final.webp` regravada em q62: 57 KB no celular; final CTA = a aula, ampliada 1.22 no pé para cortar o teto, a escala vive no tween do GSAP). A/B no Lighthouse, 3 rodadas cada, na mesma máquina: hero antiga 93/93/86, nova 93/92/83; a troca não custa nota. O Adryan pediu para deixar a hero quieta por enquanto.
- Post-its e legenda do polaroid: Scribble Kidsy (a display do Satori Kids), subset só com os glifos usados (28 KB; comando no `index.css`). A Permanent Marker saiu do site (arquivo em `reference/unused-fonts`).
- Parents: a mochila desenhada virou a foto real (`reference/uploads/kids-bag.webp` → `bag.webp` 960 / `bag-sm.webp` 600, 27 KB no celular). Sombra realista sem filtro pesado: sombra de contato + sombra larga em gradiente (`.pack__shadow`, entra junto com a mochila) e um drop-shadow neutro leve.
- Professor: foto nova do Fred de braços cruzados (`reference/uploads/fred-coach.webp` → `fred_coach`), cortada na cintura em cima da borda de baixo do painel. Fotos novas entram por `npm run uploads` (scripts/uploads.mjs → `src/data/images.uploads.gen.ts`).
- CTA: o lobo do círculo estava 8px abaixo do centro (17px em cima, 9px embaixo); centrado pela tinta (13,0 / 13,3).
- CTAs: todos os botões de agendar pulsam (anel que sai do botão a cada 2,6s) e ganham um brilho que cruza a cada 5,2s; parados no hover, no booking e com reduced motion. Tom vermelho novo (`tone="r"`, o vermelho da faixa) no hero, no Professor e no Adults.
- Hero H1: "and" branco; "the whole family has a place." na faixa amarela das outras seções (25–79%), letra preta. A hero ganhou `border-radius:inherit` nas camadas + máscara para não perder os cantos (às vezes saíam quadrados).
- Professor: cinco lobos lado a lado atrás do Fred, no tamanho de antes, sem espaço entre eles; os das pontas cortam na borda do painel (em 1080 aparecem os dois de cada lado; em 1920 o painel é mais alto e só o primeiro de cada lado aparece, cortado).
- Parents (desktop): a mochila desce e o botão passa por cima da base dela (`z-index:3`, margem negativa proporcional à mochila); no celular o botão fica no fim da seção, como antes.
- Botão vermelho: logo branca num círculo vermelho escuro (sem amarelo). Parents também com o botão vermelho.
- Parents: a mochila virou o objeto da seção (`--bag-w` clamp(420px, 44vw, 660px) no desktop, min(480px, 94vw) no celular); o botão cobre a base dela (−12% da largura). Foto em resolução cheia (1254, q70) e 760 no celular.
- Professor (desktop): o Fred virou filho do card (não da cena) e vai do topo do título até o pé do painel: ~20% maior (668px em 1440×900) e a cabeça na linha do "Meet Professor" (6–10px abaixo, de 1083 a 1920). A subida no scroll agora termina quando o card assenta sob o nav (antes terminava depois, e em repouso ele ficava baixo).
- First class: sem botão dentro dos cards; um botão vermelho na coluna 2 da linha do título. FAQ com botão vermelho.
- First class: sem o botão, o rodapé do card ficava com um vão à direita e o card com altura mínima vazia; no desktop as 4 pílulas dos passos agora ocupam a largura toda (grade de 4) e o card tem a altura do conteúdo.
- Pricing: botão vermelho embaixo dos planos (faltava).

## /v2 · tema escuro de teste (10/11/2026)
- Mesma página; `html.v2` (script no head para `/v2`, e `dist/v2/index.html` do prerender com a classe e `noindex`). Tudo em `src/styles/v2.css`, cada regra começa com `.v2`: a rota principal não muda.
- Seções brancas com o papel escuro do footer (`--color-sheet` + o mesmo grão, gerado no browser em `main.tsx`), sem o pattern do lobo. No jeito da Lion: cards um degrau mais claros com fio de luz, branco em 3 níveis (`--v-t1/2/3`).
- Mantido: faixa amarela dos títulos, botões vermelhos, post-its, polaroid, faixa branca, painel amarelo do Professor, card amarelo do First class. Preto-no-branco virou branco-no-preto (filtros, abas de dia, aulas no hover, setas e pontos das reviews). A pergunta aberta do FAQ fica amarela como o latão da Lion.
- Objetos pretos ganharam aro de luz: mochila (drop-shadow claro + brilho atrás + sombra de chão mais funda), cartão de membro, card preto do passo e review ativa. No booking os botões pretos viraram amarelos.
- Nav: sempre preta no v2. Custo na rota principal: o CSS do v2 vai inline no HTML (+~6 KB, 152 → 158 KB sem gzip). Decidido o tema, apagar o que perdeu.
- Professor (10/11, depois do v2): o painel atrás do Fred virou preto (gradiente ink-4 → ink) e os 5 lobos cinza (branco a 13%), com uma luz suave atrás dele para a rash guard preta não sumir. Vale para `/` e `/v2`.
- Professor: a sombra do card era cortada pelo `overflow:clip` da seção e coberta pelo "Three reasons"; agora corta só na horizontal e a seção pinta por cima da seguinte (`z-index:1`), igual ao First class.
- Parents: a mochila num badge igual ao do Professor (painel preto, 3 lobos cinza, luz suave atrás), um pouco mais largo que ela (−6% de cada lado; −3% no celular) para os lobos aparecerem dos dois lados; a mochila sai pelo topo, o botão vermelho fica sobre o pé. Aro de luz fino na mochila para ela não sumir no preto. No `/v2` os dois badges ganham fio de luz mais forte.
- Parents refeito: um card preto da largura do Professor (lobos cinza, luz atrás) com a mochila saindo pelo topo e o pé cortado na borda de baixo (`clip-path` só embaixo), para ela não voar. Post-its trocados por notas sem fundo, fora do card, no branco dos dois lados do topo da mochila, com flechas desenhadas à mão (SVG, traço animado no scroll) apontando para ela. Polaroid "Promotion day" removido. No celular: mochila e card primeiro, notas embaixo com um fio amarelo à esquerda. A seção não é mais alta que o conteúdo (976px em 1440×900).
- Professor: o texto quebra nas 4 linhas que o Adryan diagramou, no desktop (`PROFESSOR.body` virou array); no celular é um parágrafo só.
- `/v2`: o Adryan não gostou; não mexer mais (as regras dele não foram atualizadas para o Parents novo).
- Parents (desktop): as notas só com o título, quebrado em 2 linhas como o Adryan diagramou (`lines` em data/parents.ts), flechas amarelas. No celular seguem título + texto, sem quebra forçada.
- Parents: a mochila desceu (margem acima 64–120px no desktop, 48px no celular) e o vão branco embaixo do card foi tirado (padding de baixo da seção 24–40px): a seção ficou mais baixa (976 → 858px em 1440×900).
- Parents: desceu mais (110–170px entre o bloco do título e o card; 64px no celular) e a sombra do card não é mais cortada pelo Adults (a seção pinta por cima da seguinte, `z-index:1`, corte só na horizontal).
- Parents (desktop): foto larga da mochila com a faixa branca (`reference/uploads/kids-bag-wide.webp` → `bag_wide`, 1866 / 1200, q70, 36–89 KB) dentro do card via `<picture>` só ≥1000px; o celular segue com a quadrada. A mochila sai pelo topo e tem o pé cortado (bottom −0,12×W, depois de testar −0,1 a −0,2); o card (cantos arredondados) corta também a faixa nas laterais.

## FIM 2 · responsivo (10/11/2026)
- Ultrawide: de 1600px para cima a coluna (`.shell`, texto da hero, nav, itens do Walk-in) escala inteira por `zoom: --z` (= min(largura/1536, altura/864), script no head), então 2560 e 3440 ficam com a composição do 1536×864, só maior. Todo vw/vh das folhas foi reescrito como `calc(X / var(--zs, 1))` para alturas e full-bleed saírem do mesmo tamanho na tela.
- Mobile (tudo ≤899px, pedido do Adryan): hero com a foto numa faixa em cima e o texto embaixo no preto; Programs vira carrossel com a escadinha (70→100%); barra fixa de baixo removida (componente apagado); Adults vira conversa empilhada sem pin, cada pergunta e resposta entram ao chegar; Walk-in carrossel simples (cards 78vw, o próximo aparece); First class sem pin: 4 cards empilhados, a faixa fica grudada embaixo do nav e ganha um grau por card; Pricing com o cartão em cima dos planos; Reviews sem fade; footer: linha de cima abaixo do nav, sem o logo pequeno, endereço e "call or text" empilhados e centrados, logo grande dentro da tela, colunas só com títulos em telas baixas.
- Reviews reais do Google (8, completas e sem travessão, nome + inicial), selo "5.0 on Google · 179 reviews". Sem aggregateRating no JSON-LD (review do próprio site não ganha estrela no Google para negócio local).
- Lighthouse mobile (mediana de 3): Perf 90 · a11y 100 · BP 100 · SEO 69 (noindex da prévia) · LCP 2,3 s · CLS 0 · TBT 370 ms · 428 KB. TBT subiu de 231 para ~370 desde o primeiro FIM: não é a animação dos botões (A/B: 440 com e sem); é a tarefa de hidratação de ~500 ms, que cresceu com o conteúdo novo (5+5 lobos, 8 reviews, cards duplicados do First class no mobile). Pendência.

## Kit Novo Dash no formulário (10/11/2026)
- O formulário, o rastreamento e o envio do lead agora são do kit padrão (`Novo-Dash/novodash-workflows`, `lp-kit/`, commit 1371fe1): `src/nd/` e `api/capi.ts` copiados sem edição; o único arquivo da academia é `src/nd/client.ts`, gerado pela API do CRM (`clients.novodash.com/api/integrations/lp-kit`). GHL location `rwBVilCaf2kZlQ5hIMH0`, webhook `zf0KdF1p1Yz3SVKtp2Y7` (o mesmo link que o Adryan mandou), GA4 `G-7KKJ0D4BB3`; Pixel, Ads e Clarity vazios no CRM.
- Saíram: o meu booking (Base UI Dialog), `lib/track.ts`, `useUTMs`, `api/lead.ts`, as tags de Pixel/GA4 que o prerender injetava e as variáveis de ambiente delas. O bloco `nd:tracking` do kit está no `<head>` do `index.html`.
- Todo botão de agendar é `<a href="#book">` (componente `Cta`); cartões de programa, células da agenda e "A child / A teen / Myself" abrem o kit com `open({ audience })` (kids para criança e adolescente, adults para 16+). `/book` = `<BookPage />` sozinho, numa casca vazia `dist/book/index.html` (sem o flash da home) + rewrite no `vercel.json`. CSP liberando os domínios do kit.
- `client.ts`: nome "Lobo Jiu-Jitsu" (o CRM tem "Lobo BJJ"), telefone da página (331) 229-9993 (o CRM tem (872) 400-0844), logo branco `/images/logo.png`, foto `/images/why_prof.webp` (Fred ensinando, vertical), textos do painel tirados da página, `proof` "5.0 on Google". Regra `.nd` em `app.css`: vermelho da faixa, letra branca, ink, Inter, Saira caixa alta 900, pílula.
- Hero no celular: o botão fica sempre na primeira tela (77–131px acima do fim, 320×568 a 412×915); a ordem título, texto, botão continua, em tela baixa a foto e a letra encolhem.

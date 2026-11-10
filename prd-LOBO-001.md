# PRD · LOBO JIU-JITSU · Landing Page · `prd-LOBO-001`
**Padrão:** BLACK-BELT-UX v5.1 · **Preset:** NARRATIVA (com tipografia do OLD SCHOOL) · **Modo:** CLIENT · **Execução:** autônoma (réplica do protótipo aprovado)
**Cliente:** Lobo Jiu-Jitsu · 646 S Frontenac St, Suite 109, Aurora, IL 60504 · Head professor: Fred Lobo
**Pasta do projeto:** `D:\DOCUMENTOS\NovoDash\lobo-jiu-jitsu-aurora-il` `[CONFIRMAR caminho]`
**Protótipo aprovado (fonte da verdade visual):** `reference/prototipo-aprovado-LOBO.html` (cópia local do artefato https://claude.ai/artifact/BkCuwGgmWCAaJwhQ9QgQgJ)
**Anexos:** `reference/anexo-footer-LOBO.md` (footer pôster rasgado) · `memory/lobo-jiu-jitsu-lp-copy.md` (copy do gestor)

---

## 0. PROTOCOLO PARA O CLAUDE CODE

**0.1 Autocontido.** Este PRD + o protótipo aprovado + os anexos são o contrato. Em conflito: PRD > protótipo > memória. O que o Adryan pediu e não estiver coberto aqui vale mesmo assim e a lacuna vai para `public/memory/design-decisions.md`.
**0.1.1** Execução autônoma: `claude --dangerously-skip-permissions`.
**0.1.2** Declarar fase: "Iniciando FASE X" / "FASE X concluída".
**0.2 Stack (landing):** react ^19 · vite ^8 · tailwindcss ^4 (`@tailwindcss/vite`) · typescript ~5.9 · gsap ^3.14 (ScrollTrigger + SplitText registrados uma vez em `src/lib/gsap.ts`) · lenis (scroll suave, ver 0.13) · @base-ui/react (só primitivos sem estilo: Dialog, Accordion) · clsx + tailwind-merge (`cn()` em `src/lib/utils.ts`). Prerender estático. Deploy Vercel.
**0.3 Fases:** F0 Referências → F1 Fundação → F2 Átomos → F3 Infra (booking, tracking) → F4 Layout → F5 Seções → F6 Composição → F7 Qualidade.
**0.4 Proibições absolutas:** dado/copy hardcoded no JSX · hex fora de `index.css` · espaçamento fora da escala 4px · GSAP sem `gsap.context()` + `revert()` · emoji · alvo de toque < 44px · fonte via `<link>` (self-host com `@font-face`) · schedule como imagem · card de Programs/Why sem imagem · `<img>` sem width/height · componente com estilo padrão de biblioteca · ícone Lucide/Heroicons visível (todos desenhados no projeto, traço coerente com o lobo).
**0.4.1 Regra anti-template de criação:** cada componente visível (botão, card, accordion, campo, carrossel e controles, menu, ícones, foco) é desenhado para a Lobo, a partir do objeto da marca (o lobo facetado, a faixa, a fita amarela). Tabela na Seção 8.9. Reveals genéricos limitados a 2 gestos: `lines()` (SplitText em máscara) e `rise()`. Proibido "o mesmo fade com delay diferente". Proibido "título centralizado + subtítulo + 3 cards com ícone".
**0.4.2 Bugs proibidos:** (1) H1, CTA, preço, horários ou form com `opacity:0` no CSS-base ou sob classe de JS; (2) acento cortado por máscara: spans-máscara com `padding-block:.3em .08em; margin-block:-.3em -.08em`; (3) contador lido como "0 1 2…": valor final no HTML + `sr-only`, sempre termina (timeout, `visibilitychange`, reduced-motion); (4) decorativo por cima de preço, CTA, horários ou form; (5) excesso de pin, ver 0.13; (6) tela vazia em qualquer ponto do scroll (testar rolando devagar em 1440 e 390); (7) hydration mismatch com prerender (reduced-motion decidido no `useLayoutEffect`); (8) texto real dentro de `aria-hidden`, carrossel com `aria-hidden` em card visível, conteúdo recolhido sem `inert`; (9) copy ou hex no TSX, fonte < 12px, `alt` que não descreve a foto; (10) código morto e `memory/*.md` desatualizado no fim.
**0.5 Pendências:** marcar `[… — CONFIRMAR]` no `src/data`. Imagem pendente = `<ImagePlaceholder />` (nunca div cinza).
**0.6 Regra de ouro:** se for escrever algo pela 2ª vez, pare e extraia.
**0.7 Posicionamento:** academia independente (não é franquia nem afiliada a time grande). Copy em inglês americano. Não citar Gracie Barra, Alliance etc. Não inventar números, prêmios ou depoimentos (Seção 20).
**0.9 Referência + preset:** ver Seção 0.9 abaixo.
**0.10 Segredos:** nenhuma credencial no repo; webhook/CAPI token só em `.env` (fora do git) e nas env vars da Vercel.
**0.11 Correções de conteúdo herdado:** o site atual (lobojiu-jitsu.com) lista a linhagem sem Carlos Gracie Jr.; a copy inclui. **Não publicar linhagem** até o cliente confirmar (a seção do professor aprovada não mostra linhagem).
**0.12 Modo autônomo:** construir **todas as seções até o fim, sem parar**, replicando o protótipo aprovado. Nenhuma seção tem duas direções (o protótipo já é a direção escolhida), então **não há `/v2`**. Sem deploy em produção e sem push. No fim, escrever `public/memory/entrega.md` (o que foi construído, prints 1440 e 390 de cada seção lado a lado com o protótipo, diferenças, checklist, `[CONFIRMAR]` restantes, comando do finalizador).
**0.13 Orçamento de scroll fixo (exceção declarada):** a regra da casa é pin + sticky ≤ 3,5 telas e ≤ 30% da página. O protótipo aprovado usa 3 cenas presas (Adultos, Walk-in, Primeira aula) que somam mais que isso. Implementar com estas durações e registrar a exceção em `design-decisions.md`:
| Cena | Protótipo | Alvo no código |
|---|---|---|
| Adultos (mensagens) | 4,6 telas | **3,2 telas** (0,8 por dúvida) |
| Walk-in (galeria em profundidade) | ~4,4 telas | **2,4 telas** (13 itens, GAP 470px) |
| Primeira aula (faixa + card) | 2,4 telas | **1,8 telas** |
`[CONFIRMAR com o Adryan: exceção ao 0.4.2(5)]`. Em toda cena presa há CTA visível no fim da cena; no celular a barra fixa de booking conta como CTA. Nenhum trecho > 2,5 telas sem CTA.

### 0.9 Referência de estrutura · F0 obrigatória
1. **Protótipo aprovado** `reference/prototipo-aprovado-LOBO.html`: abrir no navegador (Playwright), ler o HTML/CSS/JS inteiro e **capturar prints no MEIO de cada mecanismo** em 1440×900 e 390×844 → `public/memory/prints/proto-*.png`. Ele é a fonte da verdade de layout, tokens, mecanismos e microinterações. O código React deve reproduzi-lo; diferenças só para cumprir este PRD.
2. **Referências de nível (abrir o código, não as docs `memory/` antigas):**
```
D:\DOCUMENTOS\NovoDash\Maison BJJ                (preset narrativa)
D:\DOCUMENTOS\NovoDash\OCJ Martial Arts          (v3 = rota / → src/v3/OcjV3App.tsx · reaproveitar src/booking/*, api/capi.ts, CSP do vercel.json)
D:\DOCUMENTOS\NovoDash\Fight Sports Club         (tipografia condensada caixa-alta, headline bicolor)
D:\DOCUMENTOS\NovoDash\satori-bjj [CONFIRMAR caminho]   (cena de mensagens que a Seção Adultos replica)
D:\DOCUMENTOS\NovoDash\ninety5-jiu-jitsu [CONFIRMAR caminho] (hero em card e régua de programas)
```
3. Registrar em `public/memory/design-decisions.md` a espinha herdada e o que é da Lobo (Seção 8). **Replicar com leitura diferente, não clonar** — mas o protótipo da Lobo, esse sim, é para ser replicado fielmente.

---

## 1. CONTEXTO E PROBLEMA REAL
**Problema-núcleo:** uma academia independente e jovem (aberta em out/2023) com um professor de credencial forte (faixa preta 3º grau IBJJF, títulos IBJJF até 2025) não tem uma página que transforme essa credencial e o ambiente familiar em agendamento de aula experimental.
- **P1** O site atual (template WordPress) não mostra o professor nem a academia; o visitante não entende o que é "Lobo".
- **P2** Pais têm medo de segurança, agressividade e de "competição obrigatória".
- **P3** Adultos iniciantes adiam por forma física, vergonha e medo de contato.
- **P4** Horários e preços não estão claros; o visitante sai para perguntar.
- **P5** O briefing do cliente quer família + credencial; a página antiga só fala "BJJ".
**Oportunidade:** credencial verificável (IBJJF) + escola pequena "onde o professor está no tatame" + grade com muitos horários adultos (11/semana) + preços claros. É exatamente o que o concorrente de franquia não pode prometer.

## 2. PERSONAS
- **Primária: mãe/pai de Aurora/Naperville, filho 4–12.** Objeção: "meu filho vai se machucar ou ficar agressivo?". Gatilho: classes por idade, professor no tatame, sofá para os pais, não precisa competir.
- **Secundária 1: adulto iniciante 25–45.** Objeção: "estou fora de forma, vou passar vergonha". Gatilho: "Start first", 11 aulas adultas/semana, chuveiros para treinar antes/depois do trabalho.
- **Secundária 2: praticante/competidor.** Objeção: "academia pequena tem nível?". Gatilho: títulos IBJJF do Fred (até 2025), Gi e No-Gi, preparação para competição.

## 3. /memory
`public/memory/briefing.md` (dados do cliente + pendências) · `design-decisions.md` (espinha herdada, exceções, divergências do protótipo) · `claude-code-rules.md` (Seção 0 resumida) · `prints/` (F0 e entrega) · `entrega.md` (0.12). Copiar `lobo-jiu-jitsu-lp-copy.md` (copy do gestor) para `public/memory/`.

## 4. ARQUITETURA
```
src/
  main.tsx · App.tsx · index.css (tokens, @font-face, utilitários)
  lib/  gsap.ts (registro único + lines()/rise()) · lenis.ts · utils.ts (cn) · time.ts (fuso America/Chicago)
  hooks/ useReducedMotion.ts · useMediaQuery.ts · useUTMs.ts · useNextClass.ts
  data/  site.ts · hero.ts · programs.ts · parents.ts · adults.ts · professor.ts · why.ts · walk.ts
         firstClass.ts · schedule.ts · pricing.ts · reviews.ts · faq.ts · finalCta.ts · location.ts · footer.ts
  types/ index.ts
  components/
    ui/       Cta.tsx (pílula + círculo do lobo) · SquareArrow.tsx · Tag.tsx · Highlight.tsx (marca-texto amarelo)
              WolfMark.tsx · Icon.tsx (ícones próprios) · ImagePlaceholder.tsx · Accordion.tsx (Base UI, estilizado)
    layout/   Nav.tsx · StickyBar.tsx · WolfPattern.tsx (padrão contínuo) · SkipLink.tsx
    sections/ Hero.tsx · Programs.tsx · Parents.tsx · Adults.tsx · Professor.tsx · Why.tsx · WalkIn.tsx
              FirstClass.tsx · Schedule.tsx · Pricing.tsx · Reviews.tsx · Faq.tsx · FinalCta.tsx · Location.tsx
    footer/   PushpinTearFooter.tsx · tear.ts (anexo)
  booking/  (reaproveitado da OCJ: modal Who → About → Contact, proxy, payload)
api/ capi.ts · lead.ts (proxy → CRM)
public/ images/ (webp) · fonts/ · memory/
vercel.json (headers + CSP da OCJ, ajustada)
```

## 5. UX MODE: CLIENT
Schedule publicado em texto, preços publicados (com `[CONFIRMAR]`), form real → proxy → CRM `[CONFIRMAR webhook do GHL]`, Pixel + CAPI reais, sticky bar no celular.

## 6. JORNADA MENTAL (vence divergências de ordem)
| # | Seção | Pergunta que responde | Mecanismo (único) |
|---|---|---|---|
| 01 | Hero | "O que é isso?" | Foto da aula como fundo do card com o texto; no scroll o card abre até as bordas |
| 02 | Programs | "Tem turma para mim/meu filho?" | Régua de crescimento: fita métrica amarela + 4 cards em escada |
| 03 | Parents | "É bom para meu filho?" | Mochila escolar azul + post-its colando |
| 04 | Adults | "E se eu estiver fora de forma?" | Cena de mensagens (formato Satori): dúvida → digitando → resposta |
| 05 | Professor | "Quem ensina?" | Fred recortado subindo de dentro do lobo amarelo gigante |
| 06 | Why Lobo | "Por que aqui e não na franquia?" | 3 painéis de foto, abre no hover |
| 07 | Walk-in | "Como é o lugar?" | Galeria em profundidade 3D (você "entra" na academia) |
| 08 | First class | "Como funciona a aula grátis?" | Faixa branca ganha um grau por passo + card que alterna amarelo/preto |
| 09 | Schedule | "Que horas?" | Quadro de parede (cabeçalho preto, dias em amarelo, Today) |
| 10 | Pricing | "Quanto custa?" | Cartão de membro que vira para o plano escolhido |
| 11 | Reviews | "Outras pessoas gostam?" | Leque de cards, ativo amarelo, fade nas laterais |
| 12 | FAQ | dúvidas restantes | Acordeão centralizado, aberto em amarelo |
| 13 | Final CTA | "Ok, como começo?" | Foto da equipe em tela cheia + chips "quem vai treinar" |
| 14 | Find us | "Onde fica?" | Mapa com pin do lobo + card de endereço |
| 15 | Footer | fechamento | Pôster rasgado com pin (anexo) |

## 7. LAYOUT
- Grid: container 1320px, gutter 20px (mobile) / 40px (≥768). Breakpoints de teste: 390, 768, 1024, 1440, 1723×953 (monitor do Adryan) e 2560×1080 (ultrawide).
- **Toda seção cabe em 100vh no desktop** (título, texto e cards visíveis sem rolar). Títulos de seção em **no máximo 2 linhas**, sem palavra sozinha na última linha (`&nbsp;` entre as duas últimas).
- Ritmo vertical variável (não `py-24` igual em tudo). Fundo: **branco em quase toda a página**, com o padrão contínuo do lobo (8.5). Seções escuras: Why Lobo (painéis), Final CTA, Find us. Footer amarelo.
- Arquétipos: nenhuma seção repete o arquétipo de outra (ver Seção 6).

## 8. DIREÇÃO DE ARTE
**8.0 Tese:** *A Lobo deve parecer o Instagram dela em movimento: preto, branco e amarelo, títulos gritados em caixa alta e fotos reais do tatame, como um pôster de academia de bairro feito com acabamento de estúdio, não um template de gym.*
- Sensação-alvo: escola de família com professor de elite no tatame.
- Metáfora âncora: **o lobo da logo** (facetado, uivando) e **o pôster** (fita, post-it, pin, papel rasgado).
- O que NÃO somos: dojo escuro agressivo; template WordPress; preto + acento neon.

**8.1 Anti-clichê:** a paleta não é preto + acento neon: o amarelo vem do Instagram oficial da academia (#FAC002, amostrado de um post) e a base é branca. Sem creme + serif + terracota. Sem broadsheet.

**8.2 Paleta (tokens em `index.css`)**
| Token | Hex | Origem / uso |
|---|---|---|
| `--color-yellow` | #FAC002 | Amarelo dos posts da Lobo. CTA, destaques, fita, post-it, folha do footer |
| `--color-yellow-2` | #E0AC00 | Hover/sombra do amarelo |
| `--color-ink` | #0B0B0C | Preto da logo. Texto, card preto, nav |
| `--color-ink-2..4` | #141416 · #1D1D20 · #2A2A2E | Superfícies escuras |
| `--color-white` | #FFFFFF | Base da página |
| `--color-off` | #F3F1EC · #E7E4DD | Papel, cards de plano |
| `--color-mute` | #6A6A70 (claro) · #A3A3AA (escuro) | Texto secundário |
| `--color-mat` | #1E46C8 · #14308F · #3D6BF0 | **Só na mochila**: o azul do tatame da academia |
Contraste AA: texto preto sobre amarelo ✓; amarelo como texto só em display ≥ 32px ou sobre preto.

**8.3 Tipografia** — ver Seção 9.

**8.4 Elevação:** `elev-1` borda 1px `--line` · `elev-2` sombra dupla (difusa 0 30px 60px -36px + contato 0 1px 0) · `elev-3` nav/modal com blur 16px. Cards amarelos usam sombra amarelada (rgba(140,100,0,.55)).

**8.5 Imagem e textura:** fotos **coloridas** (o tatame azul aparece). Proporções: hero 3:2, programas 3:4, foto de passo 4:3. Gradiente padrão de legibilidade (preto 0 → .9). **Padrão do lobo:** contorno da silhueta do lobo em SVG, traço 3px, opacidade .04, repetido a cada 240px, `background-attachment: fixed` (contínuo entre seções), máscara com fade nas laterais (transparente 0 → preto 22% → preto 78% → transparente). No celular, `scroll` e 180px. Grão de papel só no footer.

**8.6 Estrutura:** numeração só onde é sequência real (passos 1–4, contador 1/4 das dúvidas). Marca-texto amarelo (`Highlight`) é o device de título: segunda parte do título com faixa amarela **justa** (gradiente 25%–79% da altura da linha), não bloco cheio.

**8.7 Signature Moment:** **as dúvidas do adulto como mensagens** (Seção 04) e o **footer de pôster rasgado** fecham a história do pôster. Gesto contínuo: o amarelo do Instagram aparece como objeto físico (fita, post-it, folha, pin, card).

**8.8 Realidade dos assets**
| Asset | Estado | Ação |
|---|---|---|
| Fotos | 27 no Drive (`Fotos gerais`). 5 originais em alta (2400–5712px); o resto é compressão de WhatsApp (~1024px). Montagens com foto dentro de foto: não usar | Pedir os originais ao cliente `[CONFIRMAR]`. Fotografia profissional move mais que CSS |
| Foto do Fred | 1 retrato (3024px) com a logo da parede atrás | Recorte já feito no protótipo; **pedir foto em fundo liso** para recorte perfeito `[CONFIRMAR]` |
| Fachada | só 680px | Pedir foto maior `[CONFIRMAR]` |
| Logo | só PNG 525px (site atual) | Pedir SVG `[CONFIRMAR]`. Enquanto isso: silhueta vetorizada do lobo (em `WolfMark`, já usada no protótipo) + PNG para o wordmark |
| Fontes | Google Fonts | Self-host (Seção 9) |
| Vídeo | não há | Sem VSL |

**8.9 Componentes próprios (nada com estilo de biblioteca)**
| Componente | Desenho | Estados |
|---|---|---|
| `Cta` | Pílula amarela (ou preta `--k`) altura 58/46, texto Inter 700; à direita um círculo com o **lobo** | hover: o lobo levanta a cabeça (rotate 14° → -6°, spring) · active scale .98 · focus anel amarelo 3px |
| `SquareArrow` | Quadrado amarelo 48px, radius 12, seta inclinada 45° | hover: desloca (2,-2) e a seta avança |
| `Highlight` | Faixa amarela justa atrás da parte final do título | — |
| `Tag` (eyebrow) | Barra amarela 26×8 + texto 13px | — |
| Accordion (FAQ) | Card branco borda 1px, radius 18; aberto = fundo amarelo; botão + em círculo que gira 45° | hover, open, focus |
| Carrossel (Reviews) | Leque, ativo amarelo, laterais com fade | prev/next circulares 52px, dots em barra |
| Ícones | Desenhados no projeto (telefone, pin, mail, IG, FB, seta, sofá, chuveiro…) com traço 1.9 | — |
| Foco | `outline: 3px solid --yellow` (claro) / `--ink` sobre amarelo | — |

## 9. TIPOGRAFIA
- **Display:** **Saira** variável, `wdth 50` + `wght 900`, caixa alta, letter-spacing −0.004em, line-height .86 — é a fonte mais próxima dos posts do Instagram (comparada contra 25 condensadas). Usada em H1, H2, nomes de turma, preços, números de passo, "BOOK./CALL.".
- **Body:** **Inter** 400–700, 16–19px, line-height 1.55, measure ≤ 60ch.
- **Marcador (só post-its e legenda da polaroid):** **Permanent Marker**.
- Escala: H1 hero clamp(50px, 6.4vw, 110px) · H2 clamp(50px, 6.2vw, 104px) · H2 médio clamp(34px, 3.4vw, 56px) · H3 clamp(26px, 2.1vw, 34px) · body 16/17/19.
- Self-host: `public/fonts/*.woff2` + `@font-face` com `font-display: swap`. **Nada de `<link>`.**

## 10. SEÇÃO POR SEÇÃO + src/data
> Copy: **literal** do arquivo do gestor (`public/memory/lobo-jiu-jitsu-lp-copy.md`). Não reescrever. CTA único em toda a página: **"Book Your Free Trial Class"**. Mecanismos e medidas: reproduzir do protótipo (o código dele é a especificação fina).

**00 Nav** — pílula preta flutuante: logo, links (Programs, Professor, Schedule, Pricing, FAQ) e **só o botão de telefone** (sem CTA no nav). `data/site.ts`.

**01 Hero** — fundo branco; **card** (radius 28, margem 14px, altura 100vh − nav) com a foto da aula (`hero.webp`, a aula sentada no tatame com o Fred demonstrando) de fundo e gradiente da esquerda; texto **alinhado à esquerda dentro do card**: H1 (segunda parte em amarelo), sub, `Cta` amarelo. **Nada embaixo do botão** (a linha de prova e a "Micro" da copy foram removidas a pedido do Adryan). No scroll (scrub, desktop): o card abre até as bordas (margem e radius → 0), a foto de 1.12 → 1, o texto sobe e apaga. Entrada: `lines()` no H1. `data/hero.ts`.

**02 Programs** — fundo branco. Título à esquerda ("Who's stepping **on the mat?**") e lead à direita. **4 cards em escada** (Little Lobos 62%, Kids 74%, Juniors 87%, Adults 100% da altura) com a foto colorida de fundo; acima de cada card um marcador "4–7 YEARS" com tracejado; dentro: nome (Saira), etiqueta amarela de idade colada no nome, horário, `SquareArrow`. Embaixo, **fita métrica amarela** com marcas e "4 yrs · 8 yrs · 12 yrs · 16 + adult". Entrada: a fita desenrola (scaleX), os cards sobem em sequência (clip-path). Card = botão que abre o booking com a turma. Rodapé: "Private lessons by appointment." + "See the full week". `data/programs.ts`.

**03 Parents** — fundo branco. Título à esquerda, descrição à direita na mesma linha. Embaixo: **mochila escolar azul** (SVG próprio, azul do tatame, zíperes amarelos, patch redondo amarelo com o lobo preto) no centro, **post-its** dos lados (Teens get a class of their own · Your child doesn't have to compete · You're not left waiting in the car) e a **polaroid** "Promotion day". Post-it: degradê amarelo, canto dobrado, fita translúcida, sombra de papel; título em Permanent Marker. Entrada: a mochila sobe, os post-its colam um a um. CTA centralizado. No celular: mochila, depois post-its, depois polaroid. `data/parents.ts`. (O "At home & at school" foi removido.)

**04 Adults · cena de mensagens (formato Satori)** — fundo branco + padrão. Seção alta (3,2 telas, 0.13) com palco `sticky`. Topo em duas colunas separadas por fio: esquerda Tag "Adults" + título em 2 linhas (segunda com `Highlight` justo); direita contador "**1** / 4" com 4 barrinhas de progresso + descrição. Uma dúvida por vez: **balão preto enorme** com a dúvida em Saira (palavra por palavra) e "You · Seen ✓✓" (tiques ficam amarelos ao "ler") → **"digitando"** em bolha amarela → **balão amarelo** da resposta com avatar do lobo e "Lobo Jiu-Jitsu ✓ · Aurora, IL", trecho-chave em preto (Start first. · Professor Fred included. · respect and care for your training partner. · 11 adult classes a week:) → os dois saem voando (esquerda/direita). Na 4ª, aparece o CTA. Tamanhos pela altura da tela (`min(6.3vw, 8.6vh)`) para **nunca subir por cima do título** (testado em 1723×953 e 1366×768). Celular: mesma cena, sem avatar. Reduced-motion: as 4 trocas em lista. "What you can train" e "Already train?" ficam fora desta seção (pedido do Adryan: menos texto). `data/adults.ts`.

**05 Professor** — fundo branco. Tudo dentro de um **card branco** (radius 32, borda 1px, sombra suave, altura 100vh − nav). Topo do card: Tag + "Meet Professor **Fred Lobo**" à esquerda; à direita 2 frases da copy ("A black belt from Belo Horizonte, and the teacher on this mat every day. In October 2023, Lobo Jiu-Jitsu opened in Aurora.") + CTA. Embaixo, dentro do card, um **painel amarelo** (radius 24, ~64% da altura, com a silhueta do lobo em amarelo mais escuro ao fundo) de onde o **Fred recortado** sai: os pés no painel, a cabeça e o tronco acima da borda dele. Placa preta "Fred Lobo · Head professor · 3rd-degree black belt" com a faixa preta e 3 graus. Scroll: o painel sobe, o lobo cresce, o Fred sobe. Sem citação, acordeão, linhagem ou rota. O Adryan pediu "background vermelho"; foi feito no **amarelo da marca** (a Lobo não tem vermelho) `[CONFIRMAR cor do painel com o Adryan]`. `data/professor.ts`.

**06 Why Lobo** — fundo branco. Título "Three reasons families **choose Lobo**". **3 painéis de foto** lado a lado; o ativo cresce (flex 3.4) e mostra número amarelo, título e texto; os outros mostram o rótulo vertical. **Interação só por hover** (e foco/toque), **sem pin**. Celular: empilhado. `data/why.ts`.

**07 Walk-in** — fundo branco. "What you'll see **when you walk in**". Palco preso 2,4 telas com `perspective: 900px`: 13 itens (fotos coloridas e cards de fato: 2,200+ sq ft of mat · Sofas · 2 restrooms with showers · Parking · Clean) em `translate3d` vindo do fundo até passar pela câmera; o título some ao começar; barra de progresso amarela. **O último item passa e some antes do fim da cena** (sem card travado). Celular: trilho horizontal com snap. `data/walk.ts`.

**08 First class** — fundo branco. Título "Your first class, **step by step**". **Faixa branca grande** atravessando a tela (−2°), ponta preta onde entram 4 fitas brancas (graus). Abaixo, **card** com número grande + título + texto do passo, pílulas numeradas (Who · Match · Class · Options), CTA, e a foto do passo dentro do card à direita. O **card inteiro alterna**: passos 1 e 3 amarelos, 2 e 4 pretos (texto, pílula ativa e CTA invertem). Pin 1,8 telas; `floor(progress × 4)` → estado. **Celular: a mesma cena presa** (card em uma coluna, sem a foto, pílulas quebrando linha, sem o rótulo da faixa). `data/firstClass.ts`.

**09 Schedule** — fundo branco. **Quadro de parede**: tabela em texto, cabeçalho **preto com os dias em amarelo** (Saira), data abaixo; o dia de hoje (fuso America/Chicago) ganha a etiqueta amarela **"Today" na mesma linha** do dia, **sem fundo na coluna**. Domingo: coluna hachurada clara com a etiqueta vertical "No classes" **centralizada** numa pílula branca com ponto amarelo (não grudada no topo). Filtros All / Kids & Teens / Adults. Célula = botão que abre o booking com turma, dia e hora. Celular: abas de dia + lista. `data/schedule.ts` (fonte única: também alimenta o footer e o booking).
| Turma | Idades | Dias e horários |
|---|---|---|
| Little Lobos | 4–7 | Mon–Fri, 4:40–5:30 pm `[CONFIRMAR dias]` |
| Kids | 8–11 | Mon–Fri, 5:40–6:40 pm |
| Juniors | 12–15 | Mon–Thu, 6:50 pm `[CONFIRMAR término]` |
| Adults | 16+ | Mon & Thu 7:00–8:00 am · Mon–Thu 12:00–1:00 pm · Mon–Thu 6:50–8:10 pm · Sat 11:00 am–12:20 pm |

**10 Pricing** — fundo branco. Título "Clear numbers **before you enroll**", 4 **cards de plano** 2×2 (Kids Unlimited $159/mo · Adult Unlimited $159/mo · Second adult $99.99/mo · Private lessons $125/hr); selecionado = amarelo, check, sobe 4px. À direita o **cartão de membro** (1.586:1): frente preta com logo branca e o **lobo grande em amarelo** ao fundo; verso amarelo com **logo preta** e o **lobo grande em preto** ao fundo; rodapé do cartão só "Member · Aurora, IL"; ao escolher um plano o cartão **vira** mostrando o plano; inclina com o mouse. Nota: "Prepay discount plans available. We explain costs and terms clearly before you enroll, so nothing is a surprise." `data/pricing.ts` com `[CONFIRMAR]` em todos os valores.

**11 Reviews** — fundo branco. Leque de cards (ativo **amarelo**; aspas num selo quadrado 46px, amarelo nos inativos e preto no ativo; autor separado por fio fino; texto 18–21px), máscara de fade nas laterais, prev/next + dots. 2 reviews reais do site atual (texto literal, sem estrelas) + placeholders `[CONFIRMAR: 3–5 reviews reais com permissão + nota e contagem do Google]`. `data/reviews.ts`.

**12 FAQ** — fundo branco, uma coluna centralizada, **sem numeração**, 6 perguntas (I've never trained… · Is it safe for my child? · Will my child become aggressive? · Will the professor really pay attention… · My child is nervous… · Does my child, or do I, have to compete?). Uma aberta por vez, altura animada. As outras 6 da copy saíram por redundância (respondidas em outras seções) `[CONFIRMAR corte com o gestor]`. `data/faq.ts`.

**13 Final CTA** — foto da equipe em tela cheia (parallax leve), H2 com a 2ª parte em amarelo, sub, chips "A child · A teen · Myself · All of us" (abrem o booking já no passo 2), CTA + telefone.

**14 Find us** — fundo escuro. Mapa (no código: **embed real do Google Maps** com fallback desenhado se o iframe falhar) com pin do lobo pulsando e card "Get directions / Call"; ao lado fachada + contatos (ícone + texto curto). `data/location.ts`.

**15 Footer** — **pôster rasgado com pin**: implementar conforme `reference/anexo-footer-LOBO.md` (anexo obrigatório). Folha **preta** (não amarela), logo branca completa no topo, colunas com títulos em amarelo, botão amarelo, próxima aula + hora de Aurora numa pílula, e no papel a **logo preta** (não o texto "LOBO.") com sublinhado amarelo. `data/footer.ts`.

**Sticky bar (celular):** aparece quando o CTA do hero sai da tela; some com o modal aberto.

## 11. FORMULÁRIO (booking)
Reaproveitar `src/booking/*` da OCJ, com a pele da Lobo. 3 passos: **Who's training?** (A child 4–11 · A teen 12–15 · Myself 16+ · All of us) → **A little about them** (idade se criança/teen, First time / Trained before, objetivo opcional) → **Where should we reach you?** (nome, telefone, e-mail). Entradas pré-preenchidas por origem (turma/dia/hora do schedule, card de programa, chips do final). Sucesso: "We'll match you to the right class. Our team recommends the class and confirms your time." `useUTMs`, honeypot, rate limit no proxy, validação em linha. Payload: `{name, phone, email, who, age, experience, goal, program, day, time, source, utm_*, page_url}` → `api/lead.ts` → CRM `[CONFIRMAR webhook GHL]`. Lead dispara Pixel + CAPI com `event_id` deduplicado.

## 12. A11y (WCAG AA)
Alvos ≥ 44px · skip link · landmarks (header/main/footer) · foco visível próprio · `prefers-reduced-motion` = **layout alternativo** (cenas viram listas, nada vazio) · contraste AA · modal com `inert` no fundo e foco preso · accordion com `aria-expanded` · carrossel sem `aria-hidden` em card visível · pin do footer é `<button>` com label.

## 13. GLASSMORPHISM
Nav (pílula preta 92% + blur 16px), sticky bar, card do mapa, etiquetas sobre foto e backdrop do modal. Fallback `@supports not (backdrop-filter)` → fundo sólido.

## 14. ANIMAÇÕES (GSAP)
- Registro único em `src/lib/gsap.ts`; cada seção usa `useGSAP`/`gsap.context()` com `revert()` no unmount; `gsap.matchMedia()` para desktop/celular.
- Gestos genéricos permitidos: `lines()` (SplitText `mask: 'lines'`) nos H2 e `rise()`. O resto é o mecanismo próprio de cada seção (Seção 6).
- Lenis integrado ao ticker do GSAP (`lenis.on('scroll', ScrollTrigger.update)`), parado com o modal aberto. Âncoras via `lenis.scrollTo`.
- Pins: só as 3 cenas da 0.13. `anticipatePin`, `invalidateOnRefresh`. `ScrollTrigger.refresh()` após fontes e imagens carregarem.
- Reduced-motion: tudo no estado final, cenas em lista, contador com o valor final.
- **Celular:** todo efeito que funciona bem no toque fica ligado (pedido do Adryan): hero, régua dos programas (cards sobem), mochila e post-its, cena de mensagens, professor, primeira aula presa, cartão que vira, leque de reviews, footer rasgado. Ficam simplificados só o Walk-in (trilho horizontal com snap, o 3D pesa no celular) e os painéis do Why (empilhados).

## 15. PERFORMANCE + imagens
WebP, `width`/`height` em todas, `loading="lazy"` fora da primeira dobra, `fetchpriority="high"` na foto do hero (`<picture>` com srcset 1200/2000/2400). Fontes woff2 com `preload` da Saira. Lighthouse mobile ≥ 90. Imagens (origem: Drive `Fotos gerais`, recortes já feitos no protótipo):
| Arquivo | Uso | Origem |
|---|---|---|
| hero.webp | Hero | foto da aula com Fred demonstrando (2400px) |
| p_little / p_kids / p_juniors / p_adults | Programs (3:4) | fotos de turma |
| par_compete, polaroid | Parents | kids com certificados, kids em aula |
| fred_cut.webp (alfa) | Professor | retrato do Fred recortado `[CONFIRMAR foto em fundo liso]` |
| why_prof / why_family / why_space | Why | Fred observando, grupo, tatame |
| gal_* (8) | Walk-in | turmas, adultos, mulheres, kids, graduação |
| g_kids, gal_coach, step_drill, gal_group | Primeira aula | uma por passo |
| final.webp | Final CTA | equipe (1920px) |
| storefront.webp | Find us | fachada `[CONFIRMAR versão maior]` |
| logo.png, logo_black.png | Nav, cartão | PNG atual `[CONFIRMAR SVG]` |
Extrair as imagens já tratadas direto do `reference/prototipo-aprovado-LOBO.html` (data URIs) ou refazer dos originais do Drive.

## 16. SEGURANÇA
`vercel.json` com headers e CSP da OCJ (liberar Google Fonts só se não self-host; liberar `maps.google.com` para o embed; `connect-src` para o proxy e o Pixel). `.env` fora do git. Antes do deploy: `grep -r "CONFIRMAR" src/` precisa voltar vazio **ou** cada ocorrência aprovada pelo Adryan.

## 17. MICROCOPY
CTA: "Book Your Free Trial Class" (único). Booking: "Who's training?" · "A little about them" · "Where should we reach you?" · "Continue" · "Back". Erros: "Add your name." · "Add a 10-digit phone number." · "Add a valid email." Sucesso: ver Seção 11. Footer: "Tell us who's training" · "Your first class is free" · "email copied". Nada de "Submit/Learn more/Get started".

## 18. TRACKING
Meta Pixel + CAPI (`api/capi.ts` da OCJ), GA4 `[CONFIRMAR IDs]`. Eventos: `PageView` · `ViewContent` (programs, pricing, schedule visíveis) · `cta_click` (com `source`: hero, program, parents, adults, professor, first_class, schedule_cell, pricing, faq, final, final_who, sticky_bar, footer, footer_col) · `booking_open` · `booking_step` · `Lead` (com `event_id` deduplicado) · `scroll_depth` (25/50/75/100) · `tel_click` · `directions_click` · `pin_pull` (footer).

## 19. SEO / SCHEMA
`<title>`: "Lobo Jiu-Jitsu | Brazilian Jiu-Jitsu for Kids, Teens and Adults in Aurora, IL". Meta description da copy. JSON-LD `SportsActivityLocation` (nome, endereço, telefone, geo, horários da `schedule.ts`, `sameAs` IG/FB, `founder`/`employee` Fred Lobo). OG image 1200×630 (foto do hero + logo). `sitemap.xml`, `robots.txt`, canonical. H1 único.

## 20. DADOS PENDENTES
| Item | Status | Responsável | Impacto |
|---|---|---|---|
| Dias do Little Lobos (seg–sex?) | 🔴 | gestor/cliente | Schedule, Programs, footer |
| Término do Juniors | 🔴 | gestor/cliente | Schedule |
| Preços: confirmar todos; Kids Unlimited cobre as 3 turmas? | 🔴 | gestor/cliente | Pricing |
| Taxa de matrícula, uniforme, desconto à vista, contrato/cancelamento | 🔴 | cliente | Pricing (texto) |
| 3–5 reviews reais com permissão + nota e contagem do Google | 🔴 | gestor | Reviews (hoje 2 reais + placeholders) |
| Telefone aceita SMS? | 🟡 | cliente | "Call or text" |
| Fred aprova a citação? (hoje fora da página) | 🟡 | cliente | Professor |
| Cadeia exata da linhagem (hoje fora da página) | 🟡 | cliente | — |
| Títulos IBJJF: entram como selo no Professor? | 🟡 | Adryan | Professor |
| Cor do painel do Professor: amarelo (feito) ou vermelho (pedido)? | 🟡 | Adryan | Professor |
| Corte do FAQ de 12 para 6 | 🟡 | gestor | FAQ |
| Exceção do orçamento de pin (0.13) | 🟡 | Adryan | Adults, Walk-in, First class |
| Logo em SVG | 🟡 | cliente | Nav, cartão, footer |
| Fotos originais (não WhatsApp) + foto do Fred em fundo liso + fachada maior | 🟡 | cliente | todas as imagens |
| Permissão escrita para fotos de crianças | 🔴 | cliente | Programs, Parents, Walk-in |
| Wording "Wheelchair-accessible area" | 🟡 | cliente | Walk-in |
| Webhook do CRM (GHL), IDs Pixel/GA4, token CAPI | 🔴 | Novo Dash | Booking, tracking |
| Política de privacidade e termos | 🟡 | Novo Dash | Footer |
| O que vestir/levar, entrada, chegada | 🟡 | cliente | (futuro: Primeira aula) |

## 21. CHECKLIST
**Pré:** F0 feita (prints do protótipo e das refs em `public/memory/prints/`) · design-decisions.md com a espinha e a exceção 0.13 · tokens e fontes self-host.
**Durante:** cada seção comparada lado a lado com o print do protótipo (1440 e 390) · zero hex/copy no TSX · zero Lucide · cada mecanismo com reduced-motion.
**Pós:** rolar devagar a página inteira em 1440, 1723×953, 2560×1080 e 390 (sem tela vazia, sem balão sobre título, sem item travado no Walk-in) · booking de ponta a ponta · Lighthouse mobile ≥ 90 · `grep CONFIRMAR` · `entrega.md` · rodar o **finalizador** (`FIM`).

## 22. TIMELINE
D1 F0 + Fundação + Átomos · D2 Infra (booking, tracking) + Layout + Hero/Programs/Parents · D3 Adults/Professor/Why/Walk-in · D4 First class/Schedule/Pricing/Reviews/FAQ/Final/Find us/Footer · D5 Qualidade + entrega.md · D6 Finalizador + revisão do Adryan.

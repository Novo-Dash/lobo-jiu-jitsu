# Regras do projeto (PRD §0, resumido)

- **Contrato:** PRD > protótipo aprovado > memória. O protótipo (`reference/prototipo-aprovado-LOBO.html`) é replicado fielmente; diferença só para cumprir o PRD, e cada uma vai para `design-decisions.md`.
- **Stack:** React 19 · Vite 8 · Tailwind 4 (só theme + utilities, sem preflight) · TS 5.9 · GSAP 3.15 (ScrollTrigger + SplitText registrados em `src/lib/gsap.ts`) · Lenis · Base UI (Dialog, Accordion) · prerender + hydrate. Deploy Vercel.
- **Nunca:** copy no TSX (tudo em `src/data`) · hex fora de `src/index.css` · `gsap.from` (usar `fromTo`) · GSAP fora de `useGSAP` · emoji · alvo de toque < 44px · fonte por `<link>` · `<img>` sem width/height · ícone de biblioteca · texto < 12px · travessão (—) em texto que o visitante lê.
- **Gestos genéricos:** só `lines()` (H2 subindo da máscara) e `rise()`. O resto é o mecanismo de cada seção.
- **Pins:** só Adults (3,2 telas), Walk-in (2,4) e First class (1,8). Pin sempre por elemento, nunca por seletor string.
- **H1, CTA, preço, horários e form nunca nascem com opacity 0.** A entrada do hero é CSS (roda do primeiro paint).
- **Reduced motion:** `html.still` (script inline no `<head>`), cenas viram listas; `useReducedMotion` decide no layout effect.
- **Pendências:** `[CONFIRMAR]` em comentário no `src/data`. `grep -r CONFIRMAR src/` antes do deploy.
- **Segredos:** só em `.env` (fora do git) e nas env vars da Vercel. Ver `.env.example`.
- **Testes:** `node scripts/e2e.mjs` (booking, reduced motion, celular) · `node scripts/shots.mjs <url> <prefixo>` (prints no meio de cada mecanismo) · `node scripts/compare.mjs proto build <largura>` (lado a lado). Navegador sempre mudo.

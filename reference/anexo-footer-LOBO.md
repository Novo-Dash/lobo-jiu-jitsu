# Anexo · Footer "pôster rasgado" (Pushpin Tear Footer) · Lobo Jiu-Jitsu

> Anexar ao `prompt-claude-code-LOBO.md` junto do `prd-LOBO-001.md`. Este footer já foi **aprovado no protótipo**:
> https://claude.ai/artifact/BkCuwGgmWCAaJwhQ9QgQgJ (rolar até o fim da página).

## O que é
O footer da LP é uma folha amarela de pôster presa por um pin e rasgada embaixo. Quando entra na tela, o conteúdo da folha
monta, o pin cai e espeta, e a folha rasga do pin para fora (borda serrilhada, fibra branca, abas enroladas com sombra). Por baixo
aparece o papel com a **logo preta** da Lobo impressa. As abas levantam perto do cursor, o pin inclina com o mouse e, **clicando no pin**, a folha
rasga uma borda nova.

Origem: componente React "Pushpin Tear Footer" (21st.dev, @kedhareswer, https://github.com/kedhareswer/21stdev-my-components).
No protótipo ele foi **portado para JS puro com a mesma matemática** (RNG mulberry32, ridge de 84 pontos, 6 abas, `easeTear`,
`morphYs`). O código abaixo é a versão aprovada e é a fonte da verdade visual.

## Como implementar no projeto (React/Vite, padrão BLACK-BELT-UX)
1. Criar `src/components/footer/PushpinTearFooter.tsx` portando o código abaixo para React
   (refs para `svg`, `#tpfS`, `#tpfRim`, abas e gradientes; `requestAnimationFrame` só enquanto houver movimento;
   `IntersectionObserver` com threshold .22 para disparar a abertura; `ResizeObserver` para medir).
   A lógica do rasgo vai para `src/components/footer/tear.ts` (funções puras, testáveis).
2. **Sem hex hardcoded no TSX** (bug proibido 9): as cores vêm dos tokens do projeto
   (`--tpf-sheet: var(--color-ink)` #0B0B0C — **folha preta**, `--tpf-on-sheet` branco, destaques em #FAC002, `--tpf-paper` #F3F1EC, tinta do papel #0B0B0C). O pin é amarelo, sombreado a partir de #FAC002.
3. **Sem copy hardcoded**: todos os textos vêm de `src/content/footer.ts` (lista abaixo).
4. Logos: no topo da folha a **logo branca completa** (lobo + LOBO JIU-JITSU); no papel a **logo preta** grande com sublinhado amarelo (não o texto "LOBO."). "BOOK." / "CALL." em **Saira wdth 50 / wght 900, caixa alta**, sublinhado amarelo; títulos das colunas em amarelo; o resto em Inter.
5. O botão "Tell us who's training" abre o **módulo de booking do projeto** (`src/booking/*`), com `source: "footer"`.
6. A linha ao vivo mostra a **próxima aula real**, calculada a partir de `src/content/schedule.ts` no fuso `America/Chicago`
   (ex.: "Next class: Little Lobos, today at 4:40 pm"). O relógio mostra a hora de Aurora.
7. Reduced-motion: tudo aparece já montado e rasgado, sem animação (nunca footer vazio, bug proibido 1 e 6).
8. Celular (container ≤ 620px): esconder os links laterais, o crédito do IBJJF e os itens 3+ das colunas;
   a linha de baixo sobe acima da barra fixa de booking.
9. Acessibilidade: o pin é um `<button>` com `aria-label="Pull the pin: tear a new edge"`; o SVG do rasgo é `aria-hidden`;
   o toast de "email copied" é `role=status`.

## Conteúdo (src/content/footer.ts)
| Lugar | Texto / ação |
|---|---|
| Topo esquerda | Voltar ao topo · Instagram (@lobojiujitsuu) · Facebook (TeamLoboJiuJitsu) |
| Topo centro | Logo branca completa → topo |
| Topo direita | info@lobobjj.com (clicar copia, toast "email copied") |
| Centro | "Your first class is free" + botão "Tell us who's training" → booking |
| Linha ao vivo (pílula) | Próxima aula (do schedule) + "· Aurora HH:MM" → #schedule (sem flancos soltos) |
| Coluna esquerda "programs" | Little Lobos, 4–7 · Kids, 8–11 · Juniors, 12–15 · Adults, 16+ · **BOOK.** → booking |
| Coluna direita "the school" | Professor Fred · Schedule · Pricing · FAQ · **CALL.** → tel:+13312299993 |
| No papel | "646 S Frontenac St, Suite 109 · Aurora, IL" + bolha "call or text" (tel) · **logo preta** |
| Laterais do papel | directions (Google Maps, 646 S Frontenac St, Suite 109, Aurora, IL 60504) · (331) 229-9993 |
| Base | © 2026 Lobo Jiu-Jitsu · Registered with the IBJJF as Fred Lobo BJJ · By Novo Dash (link com UTM) |

## Código aprovado no protótipo

### HTML
```html
<!-- XV · FOOTER: a torn poster. The yellow sheet ripped away from a pin; LOBO printed on the paper underneath -->
<footer class="tpf" id="tpf">
  <svg class="tpf-stage" id="tpfStage" aria-hidden="true">
    <defs>
      <radialGradient id="tpfV" cx=".5" cy=".78" r=".75"><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#0b0b0c" stop-opacity=".07"/></radialGradient>
      <linearGradient id="tpfL" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>
      <pattern id="tpfG" width="160" height="160" patternUnits="userSpaceOnUse"><image id="tpfGi" width="160" height="160"/></pattern>
      <filter id="tpfD" x="-5%" y="-5%" width="110%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#0b0b0c" flood-opacity=".28"/></filter>
      <filter id="tpfF" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="-2" dy="4" stdDeviation="4" flood-color="#0b0b0c" flood-opacity=".24"/></filter>
      <g id="tpfFG"></g>
      <path id="tpfS"/>
    </defs>
    <rect class="tpf-paper" width="100%" height="100%"/>
    <rect width="100%" height="100%" fill="url(#tpfV)" style="mix-blend-mode:multiply"/>
    <rect width="100%" height="100%" fill="url(#tpfG)" opacity=".3"/>
    <g class="tpf-sheet-g" filter="url(#tpfD)"><path class="tpf-rim" id="tpfRim"/><use href="#tpfS" class="tpf-sheet"/></g>
    <use href="#tpfS" fill="url(#tpfL)"/>
    <use href="#tpfS" fill="url(#tpfG)" opacity=".45"/>
    <g filter="url(#tpfF)" id="tpfFlaps"></g>
  </svg>

  <div class="tpf-z tpf-top">
    <div class="tpf-row tpf-h" style="--i:0">
      <button type="button" class="tpf-ib tpf-up" id="tpfUp" aria-label="Back to top" title="Back to top"><svg viewBox="0 0 24 24" class="tpf-ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg></button>
      <span style="width:.6em"></span>
      <a class="tpf-ib" href="https://www.instagram.com/lobojiujitsuu" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><svg class="tpf-ico"><use href="#i-ig"/></svg></a>
      <a class="tpf-ib" href="https://www.facebook.com/TeamLoboJiuJitsu/" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook"><svg class="tpf-ico"><use href="#i-fb"/></svg></a>
    </div>
    <a class="tpf-logo tpf-h" href="#top" style="--i:1" aria-label="Lobo Jiu-Jitsu, back to top"><img src="{{IMG:logo}}" width="525" height="198" alt="Lobo Jiu-Jitsu"></a>
    <div class="tpf-h" style="--i:2;position:relative">
      <button type="button" class="tpf-mail" id="tpfMail" aria-label="Copy info@lobobjj.com" title="Copy email"><span>info@lobobjj.com</span><svg viewBox="0 0 24 24" class="tpf-ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h10a2.5 2.5 0 0 0 2.5-2.5v-6.5"/><circle cx="18.5" cy="5.5" r="2.3"/></svg></button>
      <span class="tpf-toast" id="tpfToast" role="status" aria-live="polite"></span>
    </div>
  </div>

  <div class="tpf-z tpf-news tpf-h" style="--i:3">
    <span>Your first class is free</span>
    <button type="button" class="tpf-pill" data-book data-source="footer"><span>Tell us who's training</span><span class="tpf-knob" aria-hidden="true"><svg viewBox="0 0 24 24" class="tpf-ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6.5 18.5 12 13 17.5"/></svg></span></button>
  </div>
  <a class="tpf-z tpf-status tpf-h" href="#schedule" style="--i:5"><i class="tpf-live" aria-hidden="true"></i><span id="tpfNext">See the class schedule</span><em class="tpf-clock" id="tpfClock"></em></a>

  <nav class="tpf-z tpf-col tpf-h l" style="--i:6" aria-label="Programs">
    <h3>programs<svg viewBox="0 0 24 24" class="tpf-ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3.5 15c1.8-3.2 3.6-3.2 5.4 0s3.6 3.2 5.4 0 3.6-3.2 5.4 0"/></svg></h3>
    <ul><li><a href="#programs">Little Lobos, 4–7</a></li><li><a href="#programs">Kids, 8–11</a></li><li><a href="#programs">Juniors, 12–15</a></li><li><a href="#programs">Adults, 16+</a></li></ul>
    <a class="tpf-big" href="#book" data-book data-source="footer_col">book.</a>
  </nav>
  <nav class="tpf-z tpf-col tpf-h r" style="--i:7" aria-label="The school">
    <h3>the school<svg viewBox="0 0 24 24" class="tpf-ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3.5 15c1.8-3.2 3.6-3.2 5.4 0s3.6 3.2 5.4 0 3.6-3.2 5.4 0"/></svg></h3>
    <ul><li><a href="#professor">Professor Fred</a></li><li><a href="#schedule">Schedule</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#faq">FAQ</a></li></ul>
    <a class="tpf-big" href="tel:+13312299993">call.</a>
  </nav>

  <button type="button" class="tpf-pin" id="tpfPin" data-pin="idle" aria-label="Pull the pin: tear a new edge" title="Pull the pin">
    <span class="tpf-shadow" aria-hidden="true"></span>
    <span class="tpf-tilt"><span class="tpf-drop"><span class="tpf-body" id="tpfPinBody"></span></span></span>
  </button>

  <div class="tpf-z tpf-brand tpf-ink">
    <div class="tpf-brand-top tpf-p" style="--i:0"><span class="tpf-eye">646 S Frontenac St, Suite 109 · Aurora, IL</span>
      <a class="tpf-bub" href="tel:+13312299993" aria-label="Call or text"><span class="tpf-dots" aria-hidden="true"><i></i><i></i><i></i></span><b>call or text</b></a></div>
    <a class="tpf-word" href="#top" aria-label="Lobo Jiu-Jitsu, back to top"><span><img src="{{IMG:logo_black}}" width="525" height="198" alt="Lobo Jiu-Jitsu"></span></a>
  </div>
  <a class="tpf-z tpf-side tpf-ink tpf-p l" href="https://www.google.com/maps/dir/?api=1&amp;destination=646+S+Frontenac+St+Suite+109+Aurora+IL+60504" target="_blank" rel="noopener" style="--i:1;left:27%"><span>directions</span><svg class="tpf-ico"><use href="#i-pin"/></svg></a>
  <a class="tpf-z tpf-side tpf-ink tpf-p r" href="tel:+13312299993" style="--i:2;left:73%"><span>(331) 229-9993</span><svg class="tpf-ico"><use href="#i-phone"/></svg></a>
  <div class="tpf-z tpf-foot tpf-ink">
    <span class="tpf-p" style="--i:3">© 2026 Lobo Jiu-Jitsu</span>
    <span class="tpf-credit tpf-p" style="--i:4">Registered with the IBJJF as Fred Lobo BJJ</span>
    <a class="tpf-handle tpf-p" style="--i:5" href="https://lp.novodash.com/site?utm_source=lobo-bjj-aurora-il&amp;utm_medium=referral&amp;utm_campaign=lp-footer" target="_blank" rel="noopener">By Novo Dash</a>
  </div>
</footer>
```

### CSS
```css
/* ───── XV · FOOTER: the torn poster (ported from Pushpin Tear Footer, in Lobo's colours) ───── */
.tpf{--tpf-sheet:#0B0B0C;--tpf-paper:#F3F1EC;--tpf-on-sheet:#FFFFFF;--tpf-on-paper:#0B0B0C;--tpf-rim:#FFFFFF;--tpf-sans:var(--f-b);
  position:relative;overflow:hidden;container-type:size;height:100vh;height:100svh;min-height:620px;background:var(--tpf-sheet);color:var(--tpf-on-sheet);font-family:var(--tpf-sans);isolation:isolate;-webkit-font-smoothing:antialiased;--ease:cubic-bezier(.22,1,.36,1);--fs:max(12px,1.85cqmin)}
.tpf *,.tpf *::before,.tpf *::after{box-sizing:border-box}
.tpf a{color:inherit;text-decoration:none}
.tpf button{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;cursor:pointer}
.tpf :focus-visible{outline:1.5px solid currentColor;outline-offset:4px;border-radius:4px}
.tpf-stage{position:absolute;left:0;top:0;max-width:none;display:block;pointer-events:none;z-index:0}
.tpf.is-hit .tpf-sheet-g{animation:tpf-hit .32s cubic-bezier(.3,.7,.4,1)}
.tpf-sheet{fill:var(--tpf-sheet)}.tpf-paper{fill:var(--tpf-paper)}.tpf-rim{fill:var(--tpf-rim)}
.tpf-ico{width:1.35em;height:1.35em;display:block;max-width:none;flex:none}
.tpf-z{position:absolute;z-index:2}
.tpf-ink,.tpf a.tpf-ink{color:var(--tpf-on-paper)}
.tpf-h{transition:opacity .7s var(--ease),translate .8s var(--ease),filter .7s var(--ease);transition-delay:calc(var(--i,0)*45ms)}
.tpf:not(.s1) .tpf-h{opacity:0;translate:0 10px;filter:blur(6px)}
.tpf-p{transition:opacity .8s var(--ease),translate .9s var(--ease),filter .8s var(--ease);transition-delay:calc(480ms + var(--i,0)*70ms)}
.tpf:not(.s3) .tpf-p{opacity:0;translate:0 18px;filter:blur(8px);transition-delay:0s}
.tpf-top{left:0;right:0;top:12.5%;transform:translateY(-50%);display:flex;align-items:center;justify-content:space-between;padding:0 11%;font-size:max(15px,2.6cqmin)}
.tpf-row{display:flex;align-items:center;gap:.55em}
.tpf-ib{display:grid;place-items:center;width:1.9em;height:1.9em;margin:-.3em;border-radius:50%;transition:transform .35s var(--ease),background-color .25s}
.tpf-ib:hover{transform:translateY(-2px);background:rgba(255,255,255,.1)}
.tpf-ib svg{width:1.1em;height:1.1em}
.tpf-up .tpf-ico{transform:rotate(90deg)}
.tpf-logo{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center}
.tpf-logo img{height:max(38px,5.4cqmin);width:auto;display:block;transition:transform .5s cubic-bezier(.5,1.8,.4,1)}
.tpf-logo:hover img{transform:translateY(-2px) scale(1.03)}
.tpf-mail{display:flex;align-items:center;gap:.6em;font-size:var(--fs);font-weight:600;letter-spacing:.01em;padding:.35em .2em;transition:transform .35s var(--ease)}
.tpf-mail:hover{transform:translateY(-2px)}
.tpf-mail span{background:linear-gradient(currentColor,currentColor) 0 100%/0 1.5px no-repeat;transition:background-size .4s var(--ease)}
.tpf-mail:hover span{background-size:100% 1.5px}
.tpf-mail .tpf-ico{width:1.5em;height:1.5em}
.tpf-toast{position:absolute;top:calc(100% + .5em);right:0;font-size:max(11px,1.6cqmin);font-weight:600;letter-spacing:.04em;white-space:nowrap;padding:.35em .8em;border-radius:99px;background:var(--y);color:var(--k);opacity:0;transform:translateY(-4px);transition:opacity .25s,transform .35s var(--ease);pointer-events:none}
.tpf-toast.on{opacity:1;transform:none}
.tpf-news{left:50%;top:21%;width:max-content;transform:translateX(-50%);display:grid;justify-items:center;gap:max(10px,1.6cqmin);font-size:var(--fs);font-weight:600}
.tpf .tpf-pill{position:relative;display:flex;align-items:center;justify-content:space-between;width:max(260px,40cqmin);height:max(44px,5.8cqmin);padding:0 .35em 0 1.3em;border-radius:99px;background:var(--y)!important;color:var(--k)!important;font-size:max(14px,2.05cqmin)!important;font-weight:600!important;text-align:left;transition:transform .35s var(--ease),box-shadow .3s var(--ease)}
.tpf-pill:hover{transform:translateY(-2px);box-shadow:0 14px 30px -14px rgba(11,11,12,.6)}
.tpf-knob{display:grid;place-items:center;flex:none;height:calc(100% - .6em);aspect-ratio:1;border-radius:50%;background:var(--k);color:var(--y);transition:transform .45s cubic-bezier(.5,1.7,.4,1)}
.tpf-pill:hover .tpf-knob{transform:translateX(2px) scale(1.06)}
.tpf-knob .tpf-ico{width:52%;height:52%}
.tpf-flank{top:22.4%;transform:translate(-50%,-50%);font-size:var(--fs);font-weight:700;letter-spacing:.06em;white-space:nowrap;text-transform:uppercase}
.tpf-clock{font-variant-numeric:tabular-nums}.tpf-clock i{font-style:normal;animation:tpf-blink 2s steps(1) infinite}
.tpf-status{left:50%;top:33.5%;transform:translate(-50%,-50%);display:flex;align-items:center;gap:.6em;font-size:max(13px,2cqmin);font-weight:600;white-space:nowrap;padding:.55em 1em;border-radius:99px;background:rgba(255,255,255,.07);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.tpf-status .tpf-clock{font-style:normal;opacity:.55;margin-left:.2em}
.tpf-status .tpf-clock:not(:empty)::before{content:'·';margin-right:.5em}
.tpf-live{position:relative;width:.5em;height:.5em;border-radius:50%;background:var(--y);color:var(--y)}
.tpf-live::after{content:'';position:absolute;inset:0;border-radius:50%;border:1.5px solid currentColor;animation:tpf-ping 2.2s var(--ease) infinite}
.tpf a.tpf-status:hover span{text-decoration:underline;text-underline-offset:.2em}
.tpf-col{top:22%;display:grid;gap:max(5px,.9cqmin);font-size:var(--fs);font-weight:600}
.tpf-col.l{left:14%;justify-items:start}.tpf-col.r{right:14%;justify-items:end;text-align:right}
.tpf-col h3{all:unset;display:flex;align-items:center;gap:1em;margin-bottom:max(6px,.9cqmin);font-weight:700;font-size:.85em;letter-spacing:.14em;text-transform:uppercase;color:var(--y)}
.tpf-col.r h3{flex-direction:row-reverse}
.tpf-col h3 .tpf-ico{width:1.1em;height:1.1em}
.tpf-col ul{all:unset;display:grid;gap:max(4px,.7cqmin);justify-items:inherit}
.tpf-col li{list-style:none}
.tpf-col li a{display:inline-block;color:rgba(255,255,255,.82);transition:transform .35s var(--ease),color .25s}
.tpf-col li a:hover{color:#fff}
.tpf-col.l li a:hover{transform:translateX(4px)}.tpf-col.r li a:hover{transform:translateX(-4px)}
.tpf-big{margin-top:max(6px,1cqmin);font-family:var(--f-d);font-weight:900;font-variation-settings:"wdth" 50;text-transform:uppercase;font-size:max(30px,5.4cqmin);line-height:.9;text-decoration:underline;text-decoration-thickness:max(2px,.05em);text-underline-offset:.1em;text-decoration-color:var(--y);color:#fff;transition:text-underline-offset .35s var(--ease)}
.tpf .tpf-big:hover{text-underline-offset:.2em}
.tpf-pin{position:absolute;z-index:3;left:50%;top:64%;width:max(46px,9cqmin);height:max(92px,18cqmin);transform:translate(-50%,-100%);cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.tpf-tilt{position:absolute;inset:0;transform-origin:50% 100%;transform:rotate(calc(5deg + var(--tilt,0deg)));transition:transform .7s var(--ease)}
.tpf-drop,.tpf-body{position:absolute;inset:0;transform-origin:50% 100%}
.tpf-body{transition:transform .32s var(--ease)}
.tpf-pin-svg{position:absolute;inset:0;width:100%;height:100%;max-width:none;display:block;overflow:visible}
.tpf-shadow{position:absolute;right:50%;bottom:-.5%;width:150%;height:24%;transform-origin:100% 50%;transform:rotate(16deg);transition:transform .45s var(--ease),opacity .45s}
.tpf-shadow::before,.tpf-shadow::after{content:'';position:absolute;top:50%;border-radius:50%;transform:translateY(-50%)}
.tpf-shadow::before{right:0;width:100%;height:24%;background:linear-gradient(90deg,transparent,rgba(11,11,12,.24) 60%,rgba(11,11,12,.4));filter:blur(2px)}
.tpf-shadow::after{left:-6%;width:60%;height:100%;background:radial-gradient(closest-side,rgba(11,11,12,.2),transparent);filter:blur(3px)}
.tpf:not(.s2) .tpf-pin{opacity:0;pointer-events:none}
.tpf.s2 .tpf-drop{animation:tpf-drop .62s cubic-bezier(.5,0,.75,0) both}
.tpf.s2 .tpf-shadow{animation:tpf-shade .62s cubic-bezier(.5,0,.75,0) both}
.tpf-pin:hover .tpf-body{transform:translateY(-3%)}
.tpf-pin:hover .tpf-shadow{transform:rotate(16deg) translateX(-5%) scaleX(1.06)}
.tpf-pin[data-pin=lift] .tpf-body{transform:translateY(-22%) rotate(-10deg);transition-duration:.3s}
.tpf-pin[data-pin=lift] .tpf-shadow{transform:rotate(16deg) translateX(-26%) scale(1.25);opacity:.55}
.tpf-pin[data-pin=stab] .tpf-body{animation:tpf-stab .42s cubic-bezier(.55,0,.8,.2) both}
.tpf-brand{left:50%;top:64%;width:max-content;transform:translateX(-50%);display:grid;justify-items:stretch}
.tpf-brand-top{display:flex;align-items:center;justify-content:space-between;gap:1em;padding:0 .2em 0 .4em}
.tpf-eye{font-size:max(13px,1.9cqmin);font-weight:600;letter-spacing:.01em;color:var(--mute)}
.tpf-bub{display:inline-flex;align-items:center;gap:.5em;height:1.8em;padding:0 .6em;border-radius:99px;background:rgba(11,11,12,.08);font-size:max(11px,1.6cqmin);overflow:hidden;transition:padding .45s var(--ease)}
.tpf-dots{display:flex;gap:.22em}
.tpf-dots i{width:.38em;height:.38em;border-radius:50%;background:rgba(11,11,12,.45);animation:tpf-dot 1.2s ease-in-out infinite}
.tpf-dots i:nth-child(2){animation-delay:.15s}.tpf-dots i:nth-child(3){animation-delay:.3s}
.tpf-bub b{font-weight:600;max-width:0;opacity:0;white-space:nowrap;transition:max-width .5s var(--ease),opacity .3s}
.tpf-bub:hover,.tpf-bub:focus-visible{padding:0 .8em}
.tpf-bub:hover b,.tpf-bub:focus-visible b{max-width:8em;opacity:1}
.tpf-word{display:block;text-align:center;overflow:hidden;padding:.3em .04em .5em;margin-top:.2em}
.tpf-word img{display:block;margin:0 auto;height:max(78px,min(14cqmin,20cqw));width:auto;max-width:none}
.tpf-word span{display:block;position:relative;transition:transform 1s var(--ease) .5s}
.tpf-word span::after{content:'';position:absolute;left:0;right:0;bottom:-.35em;height:6px;background:var(--y);transform-origin:0 50%;transition:transform .9s var(--ease) 1.05s,height .3s var(--ease)}
.tpf:not(.s3) .tpf-word span{transform:translateY(125%);transition-delay:0s}
.tpf:not(.s3) .tpf-word span::after{transform:scaleX(0);transition-delay:0s}
.tpf-word:hover span::after{height:10px}
.tpf-side{top:76%;display:grid;justify-items:center;gap:max(10px,1.9cqmin);font-size:max(13px,2.1cqmin);font-weight:600;transform:translateX(-50%)}
.tpf-side .tpf-ico{width:1.35em;height:1.35em;transition:transform .35s var(--ease)}
.tpf-side:hover .tpf-ico{transform:translateY(-2px) rotate(-8deg)}
.tpf-side span{background:linear-gradient(currentColor,currentColor) 0 100%/0 1.5px no-repeat;transition:background-size .4s var(--ease)}
.tpf-side:hover span{background-size:100% 1.5px}
.tpf-foot{left:0;right:0;bottom:5%;display:flex;align-items:center;justify-content:space-between;gap:1.5em;padding:0 15%;font-size:max(12px,1.85cqmin);font-weight:600}
.tpf-credit{position:absolute;left:50%;transform:translateX(-50%);font-size:max(10px,1.4cqmin);letter-spacing:.08em;text-transform:uppercase;opacity:.62;white-space:nowrap}
.tpf-handle:hover{text-decoration:underline;text-underline-offset:.2em}
@container (max-width: 620px){
.tpf-top{padding:0 7%}.tpf-mail span{display:none}.tpf-status .tpf-clock{display:none}
.tpf-news{top:20%}.tpf-pill{width:min(80cqw,320px)}
.tpf-status{top:31%}
.tpf-col{top:36.5%}.tpf-col.l{left:7%}.tpf-col.r{right:7%}.tpf-col li:nth-child(n+3){display:none}
.tpf-side{display:none}
.tpf-foot{padding:0 7%;bottom:3.5%}.tpf-credit{display:none}
}
@media (max-width:999px){.tpf{padding-bottom:0}.tpf-foot{bottom:calc(5% + 64px)}}
@keyframes tpf-hit{0%{transform:translateY(0)}30%{transform:translateY(2px)}60%{transform:translateY(-.5px)}100%{transform:translateY(0)}}
@keyframes tpf-drop{0%{transform:translateY(-62cqh) rotate(-28deg) scale(1.5);opacity:0}25%{opacity:1}80%{transform:translateY(0) rotate(3deg) scale(1)}90%{transform:scale(1.04,.95)}100%{transform:none;opacity:1}}
@keyframes tpf-shade{0%{transform:rotate(16deg) translateX(-60%) scale(2.4);opacity:0}80%{transform:rotate(16deg);opacity:1}100%{transform:rotate(16deg);opacity:1}}
@keyframes tpf-stab{0%{transform:translateY(-22%) rotate(-10deg)}70%{transform:translateY(1.5%) rotate(1deg)}100%{transform:none}}
@keyframes tpf-dot{0%,60%,100%{transform:translateY(0);opacity:.55}30%{transform:translateY(-2.5px);opacity:1}}
@keyframes tpf-blink{0%{opacity:1}50%{opacity:.25}}
@keyframes tpf-ping{0%{transform:scale(1);opacity:.9}80%,100%{transform:scale(2.6);opacity:0}}
@media (prefers-reduced-motion: reduce){.tpf *,.tpf *::before,.tpf *::after{animation:none!important;transition-duration:.01s!important;transition-delay:0s!important}}
```

### JS
```js
/* XV · the torn-poster footer, ported to plain JS from Pushpin Tear Footer (same tear maths) */
(() => {
const root = document.getElementById('tpf'); if (!root) return;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const RIDGE_N = 84, START = 1.06, FLAPS = 6;
const clamp01 = v => Number.isFinite(v) ? (v < 0 ? 0 : v > 1 ? 1 : v) : 0;
function rng(seed) { let a = (Number.isFinite(seed) ? Math.floor(seed) : 0) >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const XS = (() => { const r = rng(911), out = []; for (let i = 0; i < RIDGE_N; i++) { const u = i / (RIDGE_N - 1); const j = i > 0 && i < RIDGE_N - 1 ? (r() - 0.5) * (0.8 / RIDGE_N) : 0; out.push(-0.02 + u * 1.04 + j); } return out; })();
function ridgeFloor(x) { const d = Math.abs(x - 0.5); if (d < 0.13) return 0.39; if (d < 0.25) return 0.43; return 0.5; }
function makeTear(seed, n = RIDGE_N) {
  const r = rng(seed), ph = [r() * 6.283, r() * 6.283, r() * 6.283], ys = [], rim = [], lag = [];
  for (let i = 0; i < n; i++) {
    const x = XS[Math.min(i, XS.length - 1)], d = Math.min(1, Math.abs(x - 0.5) * 2);
    const base = 0.43 + 0.3 * Math.pow(d, 1.35);
    const wander = (0.022 * Math.sin(x * 7 + ph[0]) + 0.016 * Math.sin(x * 13 + ph[1]) + 0.01 * Math.sin(x * 29 + ph[2])) * (0.45 + 0.55 * d);
    const spike = r() < 0.16 ? 2.3 : 1, jag = (r() - 0.5) * 0.022 * spike;
    ys.push(Math.min(0.8, Math.max(ridgeFloor(x), base + wander + jag)));
    rim.push(1.2 + r() * 3.6);
    lag.push(Math.min(0.48, d * 0.4 + 0.04 + 0.03 * Math.sin(x * 23 + ph[1]) + r() * 0.012));
  }
  const slots = [0.05, 0.19, 0.33, 0.67, 0.81, 0.95], up = r() < 0.5 ? [2, 4] : [1, 3];
  const flaps = slots.map((slot, k) => {
    const x = slot + (r() - 0.5) * 0.05, span = 3 + Math.floor(r() * 5);
    const at = Math.max(0, Math.min(n - 1 - span, Math.round(x * (n - 1))));
    const dir = up.includes(k) ? -1 : 1, outer = k === 0 || k === slots.length - 1;
    const len = dir < 0 ? 0.022 + r() * 0.022 : outer ? 0.085 + r() * 0.04 : 0.045 + r() * 0.05;
    return { at, span, len, skew: (r() - 0.5) * 1.1, dir, jag: [r() - 0.5, r() - 0.5, r() - 0.5, r() - 0.5] };
  });
  return { ys, rim, lag, flaps };
}
function easeTear(t) { const x = clamp01(t); if (x === 0 || x === 1) return x; const c1 = 0.9; return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
const easeInOut = t => { const x = clamp01(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const introYs = (tear, t) => tear.ys.map((y, i) => START + (y - START) * easeTear((t - tear.lag[i]) / 0.5));
const morphYs = (from, to, t) => to.ys.map((y, i) => { const a = from[i] ?? y; return a + (y - a) * easeInOut((t - to.lag[i] * 0.6) / 0.6); });
const flapOpen = (tear, f, t) => easeTear((t - tear.lag[f.at] - 0.18) / 0.32);
function flapPoly(ys, f, W, H, open) {
  const b = Math.min(ys.length - 1, f.at + f.span), top = [];
  for (let k = f.at; k <= b; k++) top.push([XS[k] * W, ys[k] * H]);
  const A = top[0], B = top[top.length - 1], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
  const L = f.len * H * Math.max(0, open), tip = [mx + f.skew * L, my + f.dir * L];
  const side = (P, Q, j0, j1) => { const dx = Q[0] - P[0], dy = Q[1] - P[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    return [[P[0] + dx / 3 + nx * j0 * 0.22 * L, P[1] + dy / 3 + ny * j0 * 0.22 * L], [P[0] + (dx * 2) / 3 + nx * j1 * 0.22 * L, P[1] + (dy * 2) / 3 + ny * j1 * 0.22 * L]]; };
  return [...top, ...side(B, tip, f.jag[0], f.jag[1]), tip, ...side(tip, A, f.jag[2], f.jag[3])];
}
const n1 = v => Math.round(v * 10) / 10;
const polyD = pts => pts.length ? 'M' + pts.map(p => n1(p[0]) + ' ' + n1(p[1])).join('L') + 'Z' : '';
function sheetD(ys, W, H, off) { let d = 'M-20 -20L' + (W + 20) + ' -20'; for (let i = ys.length - 1; i >= 0; i--) d += 'L' + n1(XS[i] * W) + ' ' + n1(ys[i] * H - (off ? off[i] : 0)); return d + 'Z'; }
function mixHex(a, b, t) { const p = h => { const s = h.replace('#', ''); const f = s.length === 3 ? s.split('').map(c => c + c).join('') : s.padEnd(6, '0').slice(0, 6); return [0, 2, 4].map(i => parseInt(f.slice(i, i + 2), 16) || 0); };
  const x = p(a), y = p(b), k = clamp01(t); return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, '0')).join(''); }

const SHEET = '#FAC002', PAPER = '#F3F1EC'; /* SHEET here = the pin's colour */
const NS = 'http://www.w3.org/2000/svg';
const svg = document.getElementById('tpfStage'), sheetP = document.getElementById('tpfS'), rimP = document.getElementById('tpfRim');
const flapBase = mixHex(PAPER, '#ffffff', 0.35);
root.style.setProperty('--tpf-rim', mixHex(flapBase, '#ffffff', 0.6));
const gradHost = document.getElementById('tpfFG'), flapHost = document.getElementById('tpfFlaps');
const grads = [], flapEls = [];
for (let k = 0; k < FLAPS * 2; k++) {
  const g = document.createElementNS(NS, 'linearGradient'); g.setAttribute('id', 'tpfFg' + k); g.setAttribute('gradientUnits', 'userSpaceOnUse');
  [[0, mixHex(flapBase, '#2a2410', 0.34)], [.5, mixHex(flapBase, '#2a2410', 0.08)], [1, '#ffffff']].forEach(([o, c]) => { const st = document.createElementNS(NS, 'stop'); st.setAttribute('offset', o); st.setAttribute('stop-color', c); g.appendChild(st); });
  gradHost.parentNode.appendChild(g); grads.push(g);
  const p = document.createElementNS(NS, 'path'); p.setAttribute('fill', 'url(#tpfFg' + k + ')'); flapHost.appendChild(p); flapEls.push(p);
}
/* the pushpin, shaded from the sheet's yellow */
(() => {
  const base = SHEET, hi = mixHex(base, '#ffffff', 0.62), mid = base, lo = mixHex(base, '#000000', 0.42), deep = mixHex(base, '#000000', 0.66);
  document.getElementById('tpfPinBody').innerHTML = `<svg viewBox="0 0 100 200" class="tpf-pin-svg" aria-hidden="true"><defs>
  <linearGradient id="tpPs" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${lo}"/><stop offset=".24" stop-color="${mid}"/><stop offset=".4" stop-color="${hi}"/><stop offset=".58" stop-color="${mid}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
  <radialGradient id="tpPt" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${hi}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></radialGradient>
  <linearGradient id="tpPn" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#5b616b"/><stop offset=".4" stop-color="#f4f5f7"/><stop offset=".7" stop-color="#a3a9b2"/><stop offset="1" stop-color="#4a4f57"/></linearGradient>
  <filter id="tpPb" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter></defs>
  <path d="M48.3 112h3.4l-.7 76-1 4-1-4z" fill="url(#tpPn)"/><ellipse cx="50" cy="191.5" rx="3.2" ry="1.1" fill="#0b0b0c" opacity=".35"/>
  <path d="M28 103v6.5a22 7 0 0 0 44 0V103z" fill="url(#tpPs)"/><ellipse cx="50" cy="103" rx="22" ry="7" fill="url(#tpPt)"/>
  <path d="M41.5 38c1.6 16 4.6 26 3 36-1.8 10-13 19-14.6 29h40.2c-1.6-10-12.8-19-14.6-29-1.6-10 1.4-20 3-36z" fill="url(#tpPs)"/>
  <path d="M16 22v14a34 13 0 0 0 68 0V22z" fill="url(#tpPs)"/><ellipse cx="50" cy="22" rx="34" ry="13" fill="url(#tpPt)"/>
  <ellipse cx="50" cy="22" rx="33" ry="12.3" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".8"/>
  <ellipse cx="37" cy="17.5" rx="12" ry="4" fill="#fff" opacity=".7" filter="url(#tpPb)"/>
  <path d="M22 38c4 4.5 9.5 6.4 15 7" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none" stroke-linecap="round" filter="url(#tpPb)"/>
  <path d="M45 50c.8 8 1.6 14 .8 22" stroke="#fff" stroke-opacity=".45" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
})();
/* paper grain, once */
(() => { const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'); if (!g) return; const img = g.createImageData(160, 160), r = rng(42);
  for (let i = 0; i < img.data.length; i += 4) { const v = r() < 0.5 ? 0 : 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = Math.floor(r() * 46); }
  g.putImageData(img, 0, 0); document.getElementById('tpfGi').setAttribute('href', c.toDataURL()); })();

const s = { W: 0, H: 0, tear: makeTear(11), prev: null, from: [], ys: [], mode: 'wait', t0: 0, dur: 1, raf: 0, px: -1e4, py: -1e4, lift: new Array(FLAPS).fill(0), busy: false, seed: 11 };
function frame(now) {
  s.raf = 0; const { W, H, tear } = s; if (!W || !H) return;
  let busy = false, ys; const open = new Array(FLAPS).fill(1), openOld = new Array(FLAPS).fill(0);
  if (s.mode === 'wait') { ys = tear.ys.map(() => START); open.fill(0); }
  else if (s.mode === 'intro') { const p = (now - s.t0) / s.dur; ys = introYs(tear, Math.min(1, p)); tear.flaps.forEach((f, k) => open[k] = flapOpen(tear, f, Math.min(1, p))); if (p >= 1) s.mode = 'rest'; else busy = true; }
  else if (s.mode === 'morph') { const p = (now - s.t0) / s.dur; ys = morphYs(s.from, tear, Math.min(1, p)); open.fill(easeTear((p - 0.5) / 0.5)); openOld.fill(1 - easeInOut(p / 0.35)); if (p >= 1) s.mode = 'rest'; else busy = true; }
  else ys = tear.ys;
  s.ys = ys;
  tear.flaps.forEach((f, k) => { const b = Math.min(ys.length - 1, f.at + f.span); const mx = ((XS[f.at] + XS[b]) / 2) * W, my = ((ys[f.at] + ys[b]) / 2) * H;
    const target = RM ? 0 : clamp01(1 - Math.hypot(s.px - mx, s.py - my) / (0.2 * Math.max(W, 520)));
    s.lift[k] += (target - s.lift[k]) * 0.14; if (Math.abs(target - s.lift[k]) > 0.003) busy = true; open[k] *= 1 + 0.32 * s.lift[k]; });
  sheetP.setAttribute('d', sheetD(ys, W, H, tear.rim)); rimP.setAttribute('d', sheetD(ys, W, H));
  const draw = (k, f, o) => { const el = flapEls[k], g = grads[k]; if (!f || o < 0.01) return el.setAttribute('d', '');
    const pts = flapPoly(ys, f, W, H, o); el.setAttribute('d', polyD(pts)); const b = Math.min(ys.length - 1, f.at + f.span), tip = pts[f.span + 3];
    g.setAttribute('x1', ((XS[f.at] + XS[b]) / 2) * W); g.setAttribute('y1', ((ys[f.at] + ys[b]) / 2) * H); g.setAttribute('x2', tip[0]); g.setAttribute('y2', tip[1]); };
  for (let k = 0; k < FLAPS; k++) { draw(k, tear.flaps[k], open[k]); draw(FLAPS + k, s.prev?.flaps[k], openOld[k]); }
  if (busy) s.raf = requestAnimationFrame(frame);
}
const kick = () => { if (!s.raf) s.raf = requestAnimationFrame(frame); };
new ResizeObserver(() => { s.W = root.clientWidth; s.H = root.clientHeight; svg.setAttribute('width', s.W); svg.setAttribute('height', s.H); svg.setAttribute('viewBox', '0 0 ' + s.W + ' ' + s.H); kick(); }).observe(root);

/* the opening: chrome, pin, rip */
let started = false;
const later = (fn, ms) => setTimeout(fn, ms);
new IntersectionObserver(([e]) => {
  if (!e.isIntersecting || started) return; started = true;
  if (RM) { root.classList.add('s1', 's2', 's3'); s.mode = 'rest'; kick(); return; }
  root.classList.add('s1');
  later(() => root.classList.add('s2'), 640);
  later(() => { root.classList.add('is-hit', 's3'); s.mode = 'intro'; s.t0 = performance.now(); s.dur = 1550; kick(); }, 1140);
  later(() => root.classList.remove('is-hit'), 1480);
}, { threshold: 0.22 }).observe(root);

/* the flaps lift toward the pointer, the pin leans */
const pin = document.getElementById('tpfPin');
root.addEventListener('pointermove', e => { if (RM) return; const r = root.getBoundingClientRect(); s.px = e.clientX - r.left; s.py = e.clientY - r.top;
  pin.style.setProperty('--tilt', Math.max(-9, Math.min(9, (s.px / r.width - 0.5) * 18)).toFixed(2) + 'deg'); kick(); });
root.addEventListener('pointerleave', () => { s.px = s.py = -1e4; pin.style.setProperty('--tilt', '0deg'); kick(); });

/* pull the pin: it lifts, the sheet re-rips a new edge, the pin stabs back */
pin.addEventListener('click', () => {
  if (s.busy || !root.classList.contains('s3')) return;
  const swap = () => { s.seed += 1; s.prev = s.tear; s.from = s.ys.length ? s.ys : s.tear.ys; s.tear = makeTear(s.seed); };
  if (RM) { swap(); s.prev = null; s.mode = 'rest'; kick(); return; }
  s.busy = true; pin.dataset.pin = 'lift';
  later(() => { swap(); s.mode = 'morph'; s.t0 = performance.now(); s.dur = 1150; kick(); }, 300);
  later(() => pin.dataset.pin = 'stab', 1280);
  later(() => { pin.dataset.pin = 'idle'; s.busy = false; }, 1720);
});

/* back to top, copy email */
document.getElementById('tpfUp').addEventListener('click', () => { window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); });
const toast = document.getElementById('tpfToast');
const flash = m => { toast.textContent = m; toast.classList.add('on'); setTimeout(() => toast.classList.remove('on'), 1600); };
document.getElementById('tpfMail').addEventListener('click', () => { const em = 'info@lobobjj.com'; navigator.clipboard?.writeText ? navigator.clipboard.writeText(em).then(() => flash('email copied'), () => flash(em)) : flash(em); });

/* live clock in Aurora, and the next class from the real schedule */
const CL = document.getElementById('tpfClock'), NX = document.getElementById('tpfNext');
const CLASSES = { Mon: [[7*60,'Adults'],[12*60,'Adults'],[16*60+40,'Little Lobos'],[17*60+40,'Kids'],[18*60+50,'Juniors & Adults']], Tue: [[12*60,'Adults'],[16*60+40,'Little Lobos'],[17*60+40,'Kids'],[18*60+50,'Juniors & Adults']],
  Wed: [[12*60,'Adults'],[16*60+40,'Little Lobos'],[17*60+40,'Kids'],[18*60+50,'Juniors & Adults']], Thu: [[7*60,'Adults'],[12*60,'Adults'],[16*60+40,'Little Lobos'],[17*60+40,'Kids'],[18*60+50,'Juniors & Adults']],
  Fri: [[16*60+40,'Little Lobos'],[17*60+40,'Kids']], Sat: [[11*60,'Adults']], Sun: [] };
const ORDER = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmt = m => { let h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12; return h + (mm ? ':' + String(mm).padStart(2, '0') : '') + ' ' + ap; };
function tick() {
  let parts; try { parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); } catch (e) { return; }
  const g = t => parts.find(p => p.type === t)?.value; const wd = g('weekday'), h = +g('hour'), m = +g('minute');
  CL.textContent = 'Aurora ' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  const now = h * 60 + m; let di = ORDER.indexOf(wd), label = '';
  for (let k = 0; k < 8 && !label; k++) { const d = ORDER[(di + k) % 7], list = CLASSES[d].filter(c => k > 0 || c[0] > now);
    if (list.length) label = 'Next class: ' + list[0][1] + ', ' + (k === 0 ? 'today' : k === 1 ? 'tomorrow' : { Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday' }[d]) + ' at ' + fmt(list[0][0]); }
  if (label) NX.textContent = label;
}
tick(); setInterval(tick, 20000);
})();
```

// ─────────────────────────────────────────────────────────────────────────────
// prerender.mjs: runs after `vite build` and the SSR build of src/entry-server.tsx (the Gonzales /
// fight-sports script, one route).
//
// • dist/index.html: the page rendered, with its <head> (canonical, OG, JSON-LD, LCP preload) and the
//   stylesheet inline. The browser hydrates it (src/main.tsx).
// • The bundle starts after the hero photo has been presented (decode, a frame, 300 ms; 2.5 s ceiling):
//   measured on GB Lindale, it keeps the simulated LCP/FCP off the script chain.
// • Meta Pixel / GA4 base tags only when VITE_META_PIXEL_ID / VITE_GA4_ID exist. [CONFIRMAR IDs]
// • robots.txt, sitemap.xml, llms.txt. While no domain is confirmed (VITE_SITE_URL): noindex.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const must = (cond, what) => { if (!cond) throw new Error(`prerender: ${what}`) }
const read = (f) => fs.readFileSync(path.join(dist, f), 'utf8')
const write = (f, s) => fs.writeFileSync(path.join(dist, f), s)
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const EMPTY_ROOT = '<div id="root"></div>'

process.env.NODE_ENV ??= 'production'
const ssr = await import(pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href)
const { SEO, jsonLd, llms, render } = ssr
const SITE = SEO.site

// React 19 emits <link rel="preload" as="image"> for eager images inside #root; the head has the real one.
const clean = (html) => html.replace(/<link rel="preload" as="image"[^>]*\/?>/g, '')

const PIXEL = process.env.VITE_META_PIXEL_ID?.trim(), GA4 = process.env.VITE_GA4_ID?.trim()
const tracking = [
  PIXEL && `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');</script>`,
  GA4 && `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA4}');</script>`,
].filter(Boolean).join('\n')

const og = `${SITE}/og-image.jpg`, t = esc(SEO.ogTitle), d = esc(SEO.ogDescription)
const head = `<meta name="robots" content="${SEO.preview ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}">
<link rel="canonical" href="${SITE}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Lobo Jiu-Jitsu">
<meta property="og:locale" content="en_US">
<meta property="og:url" content="${SITE}/">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${og}">
<meta property="og:image:secure_url" content="${og}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(SEO.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${og}">
<meta name="format-detection" content="telephone=no">
<link rel="preload" as="image" href="/images/final.webp" imagesrcset="/images/final-sm.webp 960w, /images/final.webp 1920w" imagesizes="(max-width: 899px) calc(100vw - 20px), calc(100vw - 28px)" fetchpriority="high">
<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>${tracking ? '\n' + tracking : ''}`

const deferEntry = (html) => {
  const entry = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)
  must(entry, 'the module entry script')
  const preloads = [...html.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">/g)].map((m) => m[1])
  const loader = `<script>(function(){var d=0;function go(){if(d)return;d=1;${JSON.stringify(preloads)}.forEach(function(h){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=h;document.head.appendChild(l)});var s=document.createElement('script');s.type='module';s.crossOrigin='';s.src=${JSON.stringify(entry[1])};document.head.appendChild(s)}function later(){requestAnimationFrame(function(){setTimeout(go,300)})}var p=document.querySelector('link[rel=preload][as=image]');if(!p)requestAnimationFrame(function(){setTimeout(go,300)});else{var i=new Image();if(p.imageSrcset){i.sizes=p.imageSizes||'';i.srcset=p.imageSrcset}else{i.src=p.href}(i.decode?i.decode():Promise.resolve()).then(later,later)}setTimeout(go,2500)})()</script>`
  return html.replace(entry[0], '').replace(/\s*<link rel="modulepreload" crossorigin href="[^"]+">/g, '').replace('</body>', `${loader}\n</body>`)
}

// The stylesheet goes inline: one round trip less before the first paint (its URLs are absolute).
const cssLink = read('index.html').match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/)
must(cssLink, 'the stylesheet link')
const css = fs.readFileSync(path.join(dist, cssLink[1]), 'utf8')
must(!/url\((?!["']?(\/|data:|#))/.test(css), 'only absolute URLs in the CSS')
const tpl = read('index.html').replace(cssLink[0], `<style>${css}</style>`)
must(tpl.includes(EMPTY_ROOT) && tpl.includes('<!--lobo:head-->'), 'the template markers')

const html = clean(render())
must((html.match(/<h1[\s>]/g) ?? []).length === 1, 'exactly one <h1>')
write('index.html', deferEntry(tpl.replace('<!--lobo:head-->', head).replace(EMPTY_ROOT, `<div id="root">${html}</div>`)))

// /v2: the dark test theme, same page with html.v2, never indexed
fs.mkdirSync(path.join(dist, 'v2'), { recursive: true })
const v2 = read('index.html').replace('<html lang="en"', '<html lang="en" class="v2"').replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, nofollow">')
must(v2.includes('class="v2"'), 'the v2 html class')
write('v2/index.html', v2)

write('robots.txt', SEO.preview
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\n${['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended', 'Bingbot'].map((b) => `User-agent: ${b}\nAllow: /`).join('\n')}\n\nSitemap: ${SITE}/sitemap.xml\n`)
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/</loc><lastmod>${SEO.modified}</lastmod></url>\n</urlset>\n`)
write('llms.txt', llms())

fs.rmSync(path.join(root, 'dist-server'), { recursive: true, force: true })
// public/memory (briefing, decisions, prints) is the project's notebook (PRD 3), never the site
fs.rmSync(path.join(dist, 'memory'), { recursive: true, force: true })
console.log(`prerender: / · ${(fs.statSync(path.join(dist, 'index.html')).size / 1024).toFixed(0)} KB${SEO.preview ? ' · PREVIEW (noindex) at ' + SITE : ' · ' + SITE}${PIXEL ? ' · pixel' : ''}${GA4 ? ' · ga4' : ''}`)

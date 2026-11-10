// ─────────────────────────────────────────────────────────────────────────────
// shots.mjs: prints in the MIDDLE of every mechanism (PRD 0.9 / F0 and the delivery check).
//   node scripts/shots.mjs <url> <prefix> [widths=1440,1723,390]
// Writes public/memory/prints/<prefix>-<width>-<nn>-<name>.png. Muted browser (house rule).
// Same section ids in the prototype and the build, so the two sets line up side by side.
// ─────────────────────────────────────────────────────────────────────────────
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [url, prefix = 'shot', widths = '1440,1723,390'] = process.argv.slice(2)
if (!url) throw new Error('usage: node scripts/shots.mjs <url> <prefix> [widths]')
const outDir = path.join(root, 'public', 'memory', 'prints')
fs.mkdirSync(outDir, { recursive: true })
const VIEW = { 1440: 900, 1723: 953, 390: 844, 2560: 1080, 1366: 768, 768: 1024 }

// [name, selector, fraction of the section's scrollable range (0 = section top at the top of the screen)]
const PLAN = [
  ['hero', '#top', 0], ['hero-open', '#top', 0.55],
  ['programs', '#programs', 0], ['parents', '#kids', 0],
  ['adults-1', '#adults', 0.12], ['adults-2', '#adults', 0.38], ['adults-3', '#adults', 0.62], ['adults-4', '#adults', 0.97],
  ['professor', '#professor', 0], ['why', '#why', 0],
  ['walk-1', '#inside', 0.15], ['walk-2', '#inside', 0.5], ['walk-3', '#inside', 0.85],
  ['first-1', '#first', 0.08], ['first-2', '#first', 0.35], ['first-3', '#first', 0.6], ['first-4', '#first', 0.92],
  ['schedule', '#schedule', 0], ['pricing', '#pricing', 0], ['reviews', '#reviews', 0], ['faq', '#faq', 0],
  ['final', '#final', 0], ['location', '#location', 0], ['footer', 'footer', 0],
]

const browser = await chromium.launch({ args: ['--mute-audio', '--hide-scrollbars'] })
for (const w of widths.split(',').map(Number)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: VIEW[w] ?? 900 }, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 })
  const page = await ctx.newPage()
  await page.addInitScript(() => document.addEventListener('play', (e) => { e.target.muted = true }, true))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  // walk the page once so every lazy photo is in and the ScrollTriggers have measured
  const H = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < H; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(90) }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(900)
  let n = 0
  for (const [name, sel, frac] of PLAN) {
    const y = await page.evaluate(([sel, frac]) => {
      const el = document.querySelector(sel); if (!el) return null
      const box = el.closest('.pin-spacer') ?? el
      const top = box.getBoundingClientRect().top + scrollY
      return Math.max(0, Math.round(top + frac * Math.max(0, box.offsetHeight - innerHeight)))
    }, [sel, frac])
    if (y === null) { console.log('missing', sel); continue }
    // step in from just above, like a slow scroll, so scrubbed timelines settle
    await page.evaluate((y) => { const l = window.__lenis; if (l) l.scrollTo(y - 120, { immediate: true }); else window.scrollTo(0, y - 120) }, y)
    await page.waitForTimeout(250)
    await page.evaluate((y) => { const l = window.__lenis; if (l) l.scrollTo(y, { immediate: true }); else window.scrollTo(0, y) }, y)
    await page.waitForTimeout(name.startsWith('footer') ? 3200 : 1500)
    const file = `${prefix}-${w}-${String(n++).padStart(2, '0')}-${name}.png`
    await page.screenshot({ path: path.join(outDir, file) })
  }
  console.log(`${prefix} ${w}: ${n} prints`)
  await ctx.close()
}
await browser.close()

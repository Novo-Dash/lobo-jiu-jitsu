// geometry.mjs: the two failures PRD 21 names, measured instead of eyeballed.
//   node scripts/geometry.mjs [url]
// (1) Adults: no balloon ever rises over the title block, at every exchange, on 1723×953, 1366×768, 2560×1080, 1440×900, 390×844.
// (2) Walk-in: at the end of the pinned scene no card is still visible (the last one has gone).
// (3) How many pinned scenes exist (2 on desktop: walk-in + first class; 1 on phones).
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:4290/'
const sizes = [[1723, 953], [1366, 768], [2560, 1080], [1440, 900], [390, 844]]
const browser = await chromium.launch({ args: ['--mute-audio'] })
let bad = 0
for (const [w, h] of sizes) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 768 })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  const go = (y) => page.evaluate((y) => { window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y) }, y)
  // 1 · adults
  const sec = await page.evaluate(() => { const s = document.getElementById('adults'); return { top: s.getBoundingClientRect().top + scrollY, h: s.offsetHeight } })
  let worst = Infinity
  for (let f = 0; f <= 1.0001; f += 0.04) {
    await go(Math.round(sec.top + f * (sec.h - h))); await page.waitForTimeout(160)
    const gap = await page.evaluate(() => {
      const top = document.querySelector('.dq__top').getBoundingClientRect().bottom
      const vis = [...document.querySelectorAll('.bq,.ba')].filter((e) => { const r = e.getBoundingClientRect(); return +getComputedStyle(e).opacity > 0.05 && r.right > 0 && r.left < innerWidth })
      return vis.length ? Math.min(...vis.map((e) => e.getBoundingClientRect().top)) - top : Infinity
    })
    if (gap < worst) { worst = gap; if (gap < 0) await page.screenshot({ path: `public/memory/prints/geo-${w}-overlap.png` }) }
  }
  // 2 · walk-in end (desktop only: the phones get the rail)
  let walk = 'rail'
  if (w >= 900) {
    const st = await page.evaluate(() => { const p = document.getElementById('inside'); return { top: p.getBoundingClientRect().top + scrollY, h: p.offsetHeight } })
    await go(Math.round(st.top + st.h - h - 2)); await page.waitForTimeout(300)
    walk = await page.evaluate(() => [...document.querySelectorAll('.wi')].filter((e) => getComputedStyle(e).visibility !== 'hidden' && +e.style.opacity > 0.02).length)
  }
  // 3 · pins
  const pins = await page.evaluate(() => document.querySelectorAll('.pin-spacer').length)
  const okA = worst >= 0, okW = walk === 'rail' || walk === 0
  if (!okA || !okW) bad++
  console.log(`${w}×${h}  adults min gap under title: ${Math.round(worst)}px ${okA ? 'ok' : 'OVERLAP'} · walk-in cards still visible at the end: ${walk} ${okW ? 'ok' : 'STUCK'} · pin spacers: ${pins}`)
  await page.close()
}
await browser.close()
process.exit(bad ? 1 : 0)

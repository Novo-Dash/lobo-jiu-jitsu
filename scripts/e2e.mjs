// e2e.mjs: the kit's booking form wired to the page, the hydration, and the reduced-motion layout.
//   node scripts/e2e.mjs [url=http://localhost:4290/]
// Attribution (UTMs, click ids) is the kit's job (src/nd/attribution.ts).
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:4290/'
const browser = await chromium.launch({ args: ['--mute-audio'] })
const fail = []
const ok = (cond, what) => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${what}`); if (!cond) fail.push(what) }

// 1 · booking (the Novo Dash kit, src/nd): every #book link and the hero open the kit's form, its live
//     class list loads, a schedule cell opens it, Escape closes it. Never submitted: the kit posts to the
//     real GHL webhook (its own full test is lp-kit/e2e.cjs with the test identity + cleanup.sh).
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  ok((await page.locator('a[href="#book"]').count()) >= 8, 'the booking buttons are #book links')
  await page.click('#heroCta')
  await page.locator('.nd-dialog').waitFor()
  ok(true, 'the hero button opens the kit form')
  await page.keyboard.press('Escape'); await page.waitForTimeout(600)
  ok(!(await page.locator('.nd-dialog').count()), 'Escape closes it')
  await page.locator('.pc').first().click()
  await page.locator('.nd-dialog').waitFor(); await page.waitForTimeout(3500)
  ok((await page.locator('.nd-option-title').count()) > 0, 'a program card opens it on the live kids classes')
  await page.keyboard.press('Escape'); await page.waitForTimeout(600)
  await page.evaluate(() => document.getElementById('schedule').scrollIntoView()); await page.waitForTimeout(800)
  await page.locator('.board .cls').first().click()
  ok(await page.locator('.nd-dialog').isVisible(), 'a schedule cell opens it')
  await page.keyboard.press('Escape')
  ok(!errors.length, `no console errors (${errors.slice(0, 3).join(' | ')})`)
  const book = await page.goto(url.replace(/\/$/, '') + '/book', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  ok(book.status() === 200 && !(await page.locator('#top').count()) && (await page.locator('.nd').count()) > 0, '/book is the kit page alone')
  await page.close()
}

// 2 · reduced motion: scenes as lists, nothing hidden
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const r = await page.evaluate(() => ({
    still: document.documentElement.classList.contains('still'),
    answers: [...document.querySelectorAll('.dq__ex .ba')].filter((e) => getComputedStyle(e).opacity === '1' && e.getBoundingClientRect().height > 0).length,
    steps: [...document.querySelectorAll('.si')].filter((e) => getComputedStyle(e).opacity === '1').length,
    rail: getComputedStyle(document.querySelector('.walk__flat')).display,
    pins: document.querySelectorAll('.pin-spacer').length,
  }))
  ok(r.still && r.answers === 4 && r.steps === 4 && r.rail === 'block' && r.pins === 0, `reduced motion: 4 answers, 4 steps, the rail, no pins (${JSON.stringify(r)})`)
  await ctx.close()
}

// 3 · phone: no horizontal scroll (the sticky bar was removed, Adryan 10/11)
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  ok(!overflow, 'no horizontal scroll at 390')
  await ctx.close()
}

await browser.close()
console.log(fail.length ? `\n${fail.length} failed` : '\nall passed')
process.exit(fail.length ? 1 : 0)

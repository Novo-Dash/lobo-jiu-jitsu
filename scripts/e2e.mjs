// e2e.mjs: the booking from a click to the CRM proxy, the hydration, and the reduced-motion layout.
//   node scripts/e2e.mjs [url=http://localhost:4290/]
// Locally /api/lead only logs the lead (LEAD_WEBHOOK_URL=log), so nothing reaches a real CRM.
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:4290/'
const browser = await chromium.launch({ args: ['--mute-audio'] })
const fail = []
const ok = (cond, what) => { console.log(`${cond ? 'ok  ' : 'FAIL'} ${what}`); if (!cond) fail.push(what) }

// 1 · booking, desktop
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(e.message))
  let lead = null
  page.on('request', (r) => { if (r.url().endsWith('/api/lead')) lead = JSON.parse(r.postData() ?? '{}') })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  await page.click('#heroCta')
  await page.getByRole('dialog').waitFor()
  ok(await page.getByRole('heading', { name: "Who's training?" }).isVisible(), 'step 1 opens from the hero CTA')
  await page.getByRole('button', { name: /A child/ }).click()
  await page.fill('#f-age', '7')
  await page.getByRole('button', { name: /First time/ }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Book Your Free Trial Class' }).last().click()
  ok(await page.getByText('Add your name.').isVisible(), 'inline error: name')
  await page.fill('#f-name', 'Test Parent')
  await page.fill('#f-phone', '3315550100')
  ok((await page.inputValue('#f-phone')) === '(331) 555-0100', 'phone formats as typed')
  await page.fill('#f-email', 'test@example.com')
  const res = page.waitForResponse((r) => r.url().endsWith('/api/lead'))
  await page.getByRole('button', { name: 'Book Your Free Trial Class' }).last().click()
  ok((await res).status() === 200, '/api/lead answers 200')
  await page.getByRole('heading', { name: "We'll match you to the right class." }).waitFor()
  ok(true, 'success screen')
  ok(lead?.who === 'child' && lead?.age === '7' && lead?.experience === 'new' && lead?.source === 'hero' && !!lead?.event_id, 'payload carries who, age, experience, source, event_id')
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1000)
  ok(!(await page.getByRole('dialog').count()), 'Escape closes the sheet')

  // prefilled from the schedule: straight to step 2 with the class
  await page.evaluate(() => document.getElementById('schedule').scrollIntoView())
  await page.waitForTimeout(800)
  await page.locator('.board .cls').first().click()
  ok(await page.getByText(/From the page:/).isVisible(), 'a schedule cell opens step 2 with the class')
  await page.keyboard.press('Escape')
  ok(!errors.length, `no console errors (${errors.slice(0, 3).join(' | ')})`)
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

// 4 · campaign tracking: the UTMs and click ids of the landing URL reach the lead
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  let lead = null
  page.on('request', (r) => { if (r.url().endsWith('/api/lead')) lead = JSON.parse(r.postData() ?? '{}') })
  await page.goto(url + '?utm_source=facebook&utm_medium=paid&utm_campaign=lobo-trial&fbclid=TEST123&gclid=G456', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2500)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.click('#heroCta')
  await page.getByRole('button', { name: /Myself/ }).click()
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.fill('#f-name', 'Test Adult'); await page.fill('#f-phone', '3315550101'); await page.fill('#f-email', 'adult@example.com')
  const res = page.waitForResponse((r) => r.url().endsWith('/api/lead'))
  await page.getByRole('button', { name: 'Book Your Free Trial Class' }).last().click()
  await res
  ok(lead?.utm_source === 'facebook' && lead?.utm_campaign === 'lobo-trial' && lead?.fbclid === 'TEST123' && lead?.gclid === 'G456' && lead?.who === 'adult', 'UTMs + fbclid + gclid travel with the lead')
  await page.close()
}

await browser.close()
console.log(fail.length ? `\n${fail.length} failed` : '\nall passed')
process.exit(fail.length ? 1 : 0)

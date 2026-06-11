/* Probe: underline state after the pin, facility panels at true coordinates. */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('shots/probe', { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)

const docY = (sel) =>
  page.evaluate(
    (s) =>
      document.querySelector(s).getBoundingClientRect().top + window.scrollY,
    sel,
  )

/* ride through the whole pin so the close lands */
const movementY = await docY('#movement')
for (const f of [0.3, 0.6, 0.95, 1.05]) {
  await page.evaluate(
    (y) => window.scrollTo(0, y),
    Math.round(movementY + 1530 * f),
  )
  await page.waitForTimeout(700)
}
await page.evaluate((y) => window.scrollTo(0, y), Math.round(movementY + 1530 * 0.95))
await page.waitForTimeout(900)
await page.screenshot({ path: 'shots/probe/pin-close.png' })
const underline = await page.evaluate(() => {
  const el = document.querySelector('.js-underline')
  return getComputedStyle(el).transform
})
console.log('underline transform:', underline)

/* facility, with document coordinates this time */
const facilityY = await docY('#facility')
for (const dy of [400, 1100, 1900]) {
  await page.evaluate((y) => window.scrollTo(0, y), facilityY + dy)
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `shots/probe/fac2-${dy}.png` })
}

await browser.close()
console.log('done')

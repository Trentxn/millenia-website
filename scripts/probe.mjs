/* Targeted probes: ident mid-draw, arc states around the pin, facility load,
   rim resolve. Usage: node scripts/probe.mjs */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('shots/probe', { recursive: true })
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()
await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' })

/* ident mid-draw: countdown should show a partial, single-segment circle */
await page.waitForTimeout(450)
await page.screenshot({ path: 'shots/probe/ident-a.png' })
await page.waitForTimeout(450)
await page.screenshot({ path: 'shots/probe/ident-b.png' })
await page.waitForTimeout(2600)

/* just before the pin: arc must be fully undrawn, lines all ghost */
await page.evaluate(() => window.scrollTo(0, 700))
await page.waitForTimeout(800)
await page.screenshot({ path: 'shots/probe/pre-pin.png' })

/* one third into the pin: arc partial from the top, first lines inked */
await page.evaluate(() => window.scrollTo(0, 1500))
await page.waitForTimeout(800)
await page.screenshot({ path: 'shots/probe/pin-third.png' })

/* facility: stop long enough for lazy images */
const facilityY = await page.evaluate(
  () => document.getElementById('facility').offsetTop,
)
for (const dy of [0, 600, 1200, 1800]) {
  await page.evaluate((y) => window.scrollTo(0, y), facilityY + dy)
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `shots/probe/facility-${dy}.png` })
}

/* the rim */
await page.evaluate(() => {
  document.getElementById('join').scrollIntoView()
  window.scrollBy(0, -100)
})
await page.waitForTimeout(1400)
await page.screenshot({ path: 'shots/probe/rim.png' })

await browser.close()
console.log('done')

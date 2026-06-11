/* Verify the ticker/manifesto boundary at wide and short viewports. */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

mkdirSync('shots/probe', { recursive: true })
const browser = await chromium.launch()

for (const [w, h] of [[1920, 919], [1920, 760], [1440, 700]]) {
  const context = await browser.newContext({ viewport: { width: w, height: h } })
  const page = await context.newPage()
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  await page.waitForTimeout(4000)
  /* park the ticker mid viewport, manifesto below it */
  const tickerY = await page.evaluate(() => {
    const el = document.querySelector('.js-track')
    return el.getBoundingClientRect().top + window.scrollY
  })
  await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 300)), tickerY)
  await page.waitForTimeout(900)
  await page.screenshot({ path: `shots/probe/band-${w}x${h}.png` })

  /* check geometry: manifesto container must not cross the ticker bottom */
  const overlap = await page.evaluate(() => {
    const band = document.querySelector('.js-track').closest('div.relative')
    const eyebrow = document.getElementById('movement-heading')
    const bandRect = band.getBoundingClientRect()
    const eyeRect = eyebrow.getBoundingClientRect()
    return { bandBottom: bandRect.bottom, eyebrowTop: eyeRect.top, overlaps: eyeRect.top < bandRect.bottom }
  })
  console.log(`${w}x${h}:`, JSON.stringify(overlap))
  await context.close()
}

await browser.close()
console.log('done')

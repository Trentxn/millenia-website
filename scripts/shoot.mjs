/* Visual verification: walk the page so once-only ScrollTriggers fire, then
   capture viewport states at each stop. Usage: node scripts/shoot.mjs [url] */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const url = process.argv[2] ?? 'http://localhost:5173'
const outDir = 'shots'
mkdirSync(outDir, { recursive: true })

const viewports = [
  { w: 1440, h: 900, tag: 'desktop' },
  { w: 768, h: 1024, tag: 'tablet' },
  { w: 360, h: 740, tag: 'mobile' },
]

const browser = await chromium.launch()

for (const { w, h, tag } of viewports) {
  const context = await browser.newContext({ viewport: { width: w, height: h } })
  const page = await context.newPage()
  await page.goto(url, { waitUntil: 'networkidle' })

  /* ident plays out */
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${outDir}/${tag}-00-ident.png` })
  await page.waitForTimeout(2600)
  await page.screenshot({ path: `${outDir}/${tag}-01-hero.png` })

  const total = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  )
  const step = Math.round(h * 0.72)
  let i = 2
  for (let y = step; y <= total; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(950)
    await page.screenshot({
      path: `${outDir}/${tag}-${String(i).padStart(2, '0')}.png`,
    })
    i++
  }
  await context.close()
}

/* reduced motion sanity: the page must be complete and still */
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
})
const page = await context.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: `${outDir}/reduced-hero.png` })
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45))
await page.waitForTimeout(400)
await page.screenshot({ path: `${outDir}/reduced-mid.png` })
await context.close()

await browser.close()
console.log('done')

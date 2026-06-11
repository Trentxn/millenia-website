/* Dump ScrollTrigger geometry to find why the manifesto inks early. */
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)

const info = await page.evaluate(() => {
  const movement = document.getElementById('movement')
  const rect = movement.getBoundingClientRect()
  const sts = (window.gsap?.globalTimeline, [])
  return {
    scrollY: window.scrollY,
    movementTop: rect.top + window.scrollY,
    movementHeight: rect.height,
    heroHeight: document.getElementById('top').getBoundingClientRect().height,
    docHeight: document.documentElement.scrollHeight,
    sts,
  }
})
console.log(JSON.stringify(info, null, 2))

await page.evaluate(() => window.scrollTo(0, 700))
await page.waitForTimeout(900)
const colors = await page.evaluate(() => {
  return {
    scrollY: window.scrollY,
    lines: [...document.querySelectorAll('.js-mline')].map(
      (el) => getComputedStyle(el).color,
    ),
    pinned: !!document.querySelector('.pin-spacer'),
    movementViewportTop: document
      .getElementById('movement')
      .getBoundingClientRect().top,
  }
})
console.log(JSON.stringify(colors, null, 2))
await browser.close()

import { expect, test } from '@playwright/test'

async function seedTask(page, title, estimate, pin = false) {
  await page.getByLabel('New task').fill(title)
  await page.getByLabel(/Effort/).selectOption(String(estimate))
  await page.getByRole('button', { name: 'Add to orbit' }).click()

  if (pin) {
    await page.getByRole('button', { name: `Add ${title} to Top 3` }).click()
  }
}

test('capture recruiter-facing screenshots', async ({ page }, testInfo) => {
  test.skip(!['chromium', 'mobile-chromium'].includes(testInfo.project.name), 'Screenshot projects only')

  await page.clock.setFixedTime(new Date('2026-09-19T09:00:00Z'))
  await page.emulateMedia({ reducedMotion: 'reduce' })

  if (testInfo.project.name === 'chromium') {
    await page.setViewportSize({ width: 1440, height: 1000 })
  }

  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/')

  await seedTask(page, 'Prepare launch narrative', 30, true)
  await seedTask(page, 'Polish mobile interaction', 15, true)
  await seedTask(page, 'Review accessibility evidence', 15, true)
  await seedTask(page, 'Explore next product idea', 60, false)

  await expect(page.getByText('Prepare launch narrative').first()).toBeVisible()

  const filename =
    testInfo.project.name === 'chromium'
      ? 'orbit-desktop.png'
      : 'orbit-mobile.png'

  await page.screenshot({
    path: `artifacts/screenshots/${filename}`,
  })
})

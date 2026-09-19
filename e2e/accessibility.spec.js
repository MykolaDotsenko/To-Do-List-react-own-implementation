import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

async function scan(page) {
  return new AxeBuilder({ page }).withTags(wcagTags).analyze()
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/')
})

test('initial product surface has no automatically detectable WCAG A/AA violations', async ({ page }) => {
  const results = await scan(page)
  expect(results.violations).toEqual([])
})

test('populated and focused task state stays accessible', async ({ page }) => {
  await page.getByLabel('New task').fill('Accessible focus task')
  await page.getByRole('button', { name: 'Add to orbit' }).click()
  await page.getByRole('button', { name: 'Add Accessible focus task to Top 3' }).click()

  const results = await scan(page)
  expect(results.violations).toEqual([])
})

test('reduced motion still preserves complete product behavior', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()

  await page.getByLabel('New task').fill('Reduced motion task')
  await page.getByRole('button', { name: 'Add to orbit' }).click()
  await page.getByRole('checkbox', { name: /Mark Reduced motion task complete/ }).click()

  await expect(page.getByRole('button', { name: 'Done' })).toContainText('1')
})

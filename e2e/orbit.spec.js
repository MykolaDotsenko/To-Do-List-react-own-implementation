import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear())
  await page.goto('/')
})

async function addTask(page, title, { bucket = 'today', estimate = '15' } = {}) {
  await page.getByLabel('New task').fill(title)
  await page.getByLabel('When').selectOption(bucket)
  await page.getByLabel(/Effort/).selectOption(estimate)
  await page.getByRole('button', { name: 'Add to orbit' }).click()
}

test('capture → Top 3 → complete → reopen keeps the workflow coherent', async ({ page }) => {
  await addTask(page, 'Ship portfolio case study', { estimate: '30' })

  await expect(page.getByText('Ship portfolio case study').first()).toBeVisible()

  await page.getByRole('button', { name: 'Add Ship portfolio case study to Top 3' }).click()
  await expect(page.getByRole('button', { name: 'Remove Ship portfolio case study from Top 3' })).toBeVisible()
  await expect(page.getByText('Start here')).toBeVisible()

  await page.getByRole('button', { name: 'Complete & continue' }).click()
  await expect(page.getByRole('button', { name: 'Done' })).toContainText('1')

  await page.getByRole('button', { name: 'Done' }).click()
  await expect(page.getByText('Ship portfolio case study').first()).toBeVisible()

  await page.getByRole('checkbox', { name: /Mark Ship portfolio case study active/ }).check()
  await expect(page.getByRole('button', { name: 'Today' })).toContainText('1')
})

test('Top 3 is an invariant, not only a visual suggestion', async ({ page }) => {
  for (const title of ['Plan launch', 'Polish mobile', 'Write docs', 'Read backlog']) {
    await addTask(page, title)
  }

  for (const title of ['Plan launch', 'Polish mobile', 'Write docs']) {
    await page.getByRole('button', { name: `Add ${title} to Top 3` }).click()
  }

  await expect(page.getByRole('button', { name: 'Add Read backlog to Top 3' })).toBeDisabled()
  await expect(page.getByText('3/3')).toBeVisible()
})

test('deletion is recoverable and persistence survives reload', async ({ page }) => {
  await addTask(page, 'Recoverable task')
  await page.getByRole('button', { name: 'Delete Recoverable task' }).click()

  await expect(page.getByText('Task removed')).toBeVisible()
  await page.getByRole('button', { name: /Undo/ }).click()
  await expect(page.getByText('Recoverable task').first()).toBeVisible()

  await page.reload()
  await expect(page.getByText('Recoverable task').first()).toBeVisible()
})

test('keyboard shortcuts move focus without hijacking text inputs', async ({ page }) => {
  await page.keyboard.press('n')
  await expect(page.getByLabel('New task')).toBeFocused()

  await page.getByLabel('New task').fill('n stays text here')
  await expect(page.getByLabel('New task')).toHaveValue('n stays text here')

  await page.getByRole('link', { name: 'Orbit home' }).click()
  await page.keyboard.press('/')
  await expect(page.getByLabel('Search tasks')).toBeFocused()
})

test('blocked storage degrades to an explicit session-only experience', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new DOMException('Storage blocked', 'SecurityError')
      },
    })
  })

  await page.reload()

  await expect(page.getByText(/Browser storage is unavailable/)).toBeVisible()
  await addTask(page, 'Session-only task')
  await expect(page.getByText('Session-only task').first()).toBeVisible()
})

test('mobile workflow has no horizontal overflow and keeps thumb navigation visible', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'), 'Mobile-specific regression')

  await expect(page.getByRole('navigation', { name: 'Mobile task views' })).toBeVisible()
  await addTask(page, 'Mobile-first task', { estimate: '5' })

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)

  await page.getByRole('button', { name: 'Top 3' }).click()
  await expect(page.getByText('Nothing is asking for attention here.')).toBeVisible()
})

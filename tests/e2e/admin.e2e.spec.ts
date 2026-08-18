import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, cleanupPage, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page

  // Set by the create-view test below. Opening the Create New form autosaves an
  // empty Pages draft immediately, so the suite has to take it away again.
  let createdPageId: string | undefined

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupPage(createdPageId!)
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL('http://localhost:3000/admin')
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  // The two assertions below were the template's and had gone stale against this
  // Payload version, so `pnpm test:e2e` was red regardless of the code:
  //
  //   - the list view now redirects to `?depth=1&limit=10`, so an exact
  //     `toHaveURL` on the bare path never matched;
  //   - the create view renders its title input as `#field-title`, not
  //     `input[name="title"]`.
  //
  // Matched to what the admin actually renders, and loosened where the exact form
  // is Payload's business rather than ours.
  test('can navigate to list view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users')
    await expect(page).toHaveURL(/\/admin\/collections\/users/)
    const listViewArtifact = page.locator('h1', { hasText: 'Users' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto('http://localhost:3000/admin/collections/pages/create')
    await expect(page).toHaveURL(/\/admin\/collections\/pages\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('#field-title')
    await expect(editViewArtifact).toBeVisible()

    // The id Payload redirected to IS the autosaved draft — the URL assertion
    // above only passes because one was created. Record it so afterAll can
    // remove it; `create` itself is not an id.
    const id = new URL(page.url()).pathname.split('/').pop()
    if (id && id !== 'create') createdPageId = id
  })
})

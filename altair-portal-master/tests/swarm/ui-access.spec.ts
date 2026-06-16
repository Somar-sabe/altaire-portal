// GPT-Codex (G) BEGIN: deterministic browser access checks replacing the stale root security spec.
import { expect, test, type Page } from '@playwright/test';
import { SWARM_PASSWORD, SWARM_PERSONAS, type SwarmPersona } from './personas';

const personaByKey = Object.fromEntries(SWARM_PERSONAS.map((persona) => [persona.key, persona]));

async function loginPersona(page: Page, persona: SwarmPersona) {
  await page.addInitScript((id) => {
    localStorage.setItem(`altair_onboarded_${id}`, 'true');
  }, persona.seedId);

  const csrfResponse = await page.request.get('/api/auth/csrf');
  expect(csrfResponse.ok(), 'GET /api/auth/csrf').toBe(true);

  const { csrfToken } = await csrfResponse.json();
  const loginResponse = await page.request.post('/api/auth/callback/credentials', {
    form: {
      csrfToken,
      email: persona.email,
      password: SWARM_PASSWORD,
      redirect: 'false',
      callbackUrl: '/overview',
    },
    maxRedirects: 0,
  });

  expect([200, 302], `login ${persona.key}`).toContain(loginResponse.status());
  await page.goto('/overview', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible({ timeout: 20000 });
}

async function waitForLeadsApi(page: Page) {
  return page.waitForResponse((response) => (
    response.url().includes('/api/leads')
    && response.request().method() === 'GET'
  ), { timeout: 30000 });
}

test.describe('ui access gates', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(60000);

  test('unauthenticated dashboard navigation redirects to the landing login', async ({ page }) => {
    await page.goto('/leads');

    await expect(page).toHaveURL(/\/\?from=%2Fleads$/);
    await expect(page.getByRole('button', { name: 'Workspace Login' })).toBeVisible();
  });

  test('restricted agent can open shell but receives a 403 leads data gate', async ({ page }) => {
    await loginPersona(page, personaByKey['restricted-agent']);

    const leadsResponsePromise = waitForLeadsApi(page);
    await page.goto('/leads');
    const leadsResponse = await leadsResponsePromise;

    expect(leadsResponse.status()).toBe(403);
    await expect(page.getByText('No matching leads found')).toBeVisible({ timeout: 30000 });
  });

  test('agent reaches the leads workspace and receives lead data', async ({ page }) => {
    await loginPersona(page, personaByKey.agent);

    const leadsResponsePromise = waitForLeadsApi(page);
    await page.goto('/leads');
    const leadsResponse = await leadsResponsePromise;

    expect(leadsResponse.status()).toBe(200);
    await expect(page.getByText('Leads', { exact: true })).toBeVisible({ timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Table view' })).toBeVisible({ timeout: 30000 });
  });
});
// GPT-Codex (G) END: UI access coverage now uses seeded personas, stable waits, and active testDir paths.

import { expect, test, type Page } from '@playwright/test';
import { SWARM_PASSWORD, SWARM_PERSONAS, type SwarmPersona } from './personas';

test.describe.configure({ mode: 'parallel' });

async function loginPersona(page: Page, persona: SwarmPersona) {
  if (persona.skipOnboarding) {
    await page.addInitScript((id) => {
      localStorage.setItem(`altair_onboarded_${id}`, 'true');
    }, persona.seedId);
  }

  await page.goto('/');
  await page.getByRole('button', { name: 'Workspace Login' }).click();
  await page.getByRole('button', { name: 'Registered Account' }).click();
  await expect(page.getByPlaceholder('name@company.com')).toBeVisible({ timeout: 15000 });
  await page.getByPlaceholder('name@company.com').fill(persona.email);
  await page.getByPlaceholder('••••••••').fill(SWARM_PASSWORD);
  await page.getByRole('button', { name: 'Sign In to Workspace' }).click();
  await page.waitForURL('**/overview', { timeout: 20000 });

  const launchWorkspace = page.getByRole('button', { name: 'Launch Workspace' });
  if (!persona.skipOnboarding) {
    try {
      await launchWorkspace.waitFor({ state: 'visible', timeout: 10000 });
      await launchWorkspace.click();
    } catch (e) {
      // Not visible or timed out
    }
  }

  await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible({ timeout: 20000 });
}

async function openRoute(page: Page, label: string, path: string) {
  await page.waitForTimeout(500);
  await page.getByRole('link', { name: label }).click();
  await page.waitForURL(`**${path}`);
}

async function probeOverview(page: Page) {
  await expect(page.getByText('Total Deals', { exact: true })).toBeVisible({ timeout: 30000 });
  await expect(page.getByText('Latest Activity')).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'View All' }).first().click();
}

async function probeLeads(page: Page, persona: SwarmPersona) {
  await expect(page.getByText('Leads', { exact: true })).toBeVisible({ timeout: 30000 });
  await expect(page.getByRole('button', { name: 'Table view' })).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Table view' }).click();
  await page.getByRole('button', { name: 'Kanban view' }).click();
  await page.getByRole('button', { name: 'Grid view' }).click();

  const stageSelect = page.locator('#leads-toolbelt-bar select').nth(0);
  const qualitySelect = page.locator('#leads-toolbelt-bar select').nth(1);
  await stageSelect.selectOption('Booked');
  await qualitySelect.selectOption('Qualified');
  await page.getByPlaceholder('Search leads...').fill('Ahmed');

  await page.getByRole('button', { name: 'Import CSV' }).click();
  await expect(page.getByText('Smart Excel & CSV Lead Importer')).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Cancel' }).click();

  await page.getByRole('button', { name: 'New Lead' }).click();
  await expect(page.getByText('Lead Details')).toBeVisible({ timeout: 30000 });
  await page.getByLabel('Lead Name').fill(`${persona.firstName} Test Lead`);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByText('Assign Agent')).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();

  if (persona.role === 'SUPER_ADMIN' || persona.role === 'ADMIN' || persona.role === 'MANAGER') {
    await page.getByPlaceholder('Search leads...').fill('');
    await stageSelect.selectOption({ label: 'All Stages' });
    await qualitySelect.selectOption({ label: 'All Quality Options' });
    await page.getByText('Ahmed Al-Farsi').first().click();
    await expect(page.getByText('Details', { exact: true })).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: 'Projects' }).click();
    await expect(page.getByText('Sent Projects')).toBeVisible({ timeout: 30000 });
    await page.getByRole('button', { name: 'Close Dialog' }).click();
  }
}

async function probeMarketing(page: Page) {
  await expect(page.getByText('Marketing Hub')).toBeVisible({ timeout: 30000 });
  for (const tab of ['Dashboard', 'Campaign Planning', 'Content Calendar', 'Budget', 'Swipe Files']) {
    await page.getByRole('button', { name: tab }).click();
  }
  await expect(page.getByText('Swipe Files')).toBeVisible({ timeout: 30000 });
}

async function probeReports(page: Page) {
  await expect(page.getByText('Reports & Analytics')).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Export Report' }).click();
  await page.getByRole('button', { name: 'Generate New' }).click();
  await page.getByRole('button', { name: 'View All' }).first().click();
}

async function probeWorkspace(page: Page) {
  await expect(page.getByText('Workspace', { exact: true })).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Direct' }).click();
  await page.getByPlaceholder('Search team member...').fill('Omar');
  await page.getByPlaceholder('Search team member...').fill('');
  await page.getByRole('button', { name: 'Spaces' }).click();
  await page.getByRole('button', { name: 'General' }).click();
  await expect(page.getByPlaceholder('Message #General...')).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Direct' }).click();
  await page.getByText('Omar Farouq').first().click();
  await expect(page.getByPlaceholder('Message Omar Farouq...')).toBeVisible({ timeout: 30000 });
}

async function probeTeam(page: Page) {
  await expect(page.getByRole('heading', { name: 'Team Members' })).toBeVisible({ timeout: 30000 });
  await page.getByPlaceholder('Search members...').fill('Sara');
  await page.getByRole('button', { name: 'Filter' }).click();
  await expect(page.getByText('Filter Members')).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Reset Filters' }).click();
  await page.getByRole('button', { name: 'Apply Filters' }).click();
  await page.getByText('Sara Al-Mansouri').first().click();
  await expect(page.getByText('User Profile')).toBeVisible({ timeout: 30000 });
}

async function probeCompany(page: Page) {
  await expect(page.getByText('Company & Organization')).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Edit Profile' }).click();
  await page.getByLabel('Legal Name of EnterpriseLabel').fill('Altair CRM Holdings');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'Roster & Team Management →' }).first().click();
  await expect(page.getByText('Department')).toBeVisible({ timeout: 30000 });
  await page.locator('#department-detail-page button').first().click();
}

async function probeSettings(page: Page) {
  await expect(page.getByText('System Settings')).toBeVisible({ timeout: 30000 });
  await page.getByRole('button', { name: 'Security & Access' }).click();
  await page.getByRole('button', { name: 'Organization' }).click();
  await page.getByRole('button', { name: 'Notifications' }).click();
  await page.getByRole('button', { name: 'Account Details' }).click();
  await page.getByRole('button', { name: 'Dark Mode' }).click().catch(() => {});
}

async function probeFeed(page: Page) {
  await expect(page.getByText('Company Feed')).toBeVisible({ timeout: 30000 });
  await page.getByText('Pipeline Review').click();
  await page.getByText('New Feature').click();
}

test.describe('persona swarm exploration', () => {
  for (const persona of SWARM_PERSONAS) {
    test(`${persona.key} examines the app`, async ({ page }) => {
      test.setTimeout(180000);
      await loginPersona(page, persona);

      for (const route of persona.routes) {
        const navLabel = route === '/overview'
          ? 'Overview'
          : route === '/leads'
            ? 'Leads'
          : route === '/feed'
              ? 'Company Feed'
              : route === '/marketing'
                ? 'Marketing'
              : route === '/reports'
                  ? 'Reports'
              : route === '/workspace'
                    ? 'Workspace'
              : route === '/team'
                      ? 'Team'
                      : route === '/company'
                        ? 'Acme Corp'
                        : route === '/settings'
                          ? 'Settings'
                          : 'Help & Support';

        await openRoute(page, navLabel, route);

        if (route === '/overview') await probeOverview(page);
        if (route === '/leads') await probeLeads(page, persona);
        if (route === '/marketing') await probeMarketing(page);
        if (route === '/reports') await probeReports(page);
        if (route === '/workspace') await probeWorkspace(page);
        if (route === '/team') await probeTeam(page);
        if (route === '/company') await probeCompany(page);
        if (route === '/settings') await probeSettings(page);
        if (route === '/feed') await probeFeed(page);
        if (route === '/help') await expect(page.getByText('Help & Support')).toBeVisible({ timeout: 30000 });
      }

      if (persona.key === 'restricted-agent') {
        await page.goto('/leads');
        await expect(page).not.toHaveURL(/\/leads/);
      }
    });
  }
});

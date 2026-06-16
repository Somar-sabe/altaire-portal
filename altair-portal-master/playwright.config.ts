import { defineConfig, devices } from '@playwright/test';

const port = process.env.CRM_E2E_PORT ?? '3001';
const baseURL = process.env.CRM_E2E_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/swarm',
  globalSetup: './tests/swarm/global-setup.ts',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    env: {
      AUTH_URL: baseURL,
      NEXTAUTH_URL: baseURL,
    },
    reuseExistingServer: true,
    timeout: 120000,
  },
});

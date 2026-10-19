import { defineConfig } from '@playwright/test';

// End-to-end tests run against the production build (npm run build first).
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4179',
    launchOptions: process.env.CI ? {} : { executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' },
    locale: 'tr-TR',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'node scripts/serve.mjs 4179',
    url: 'http://localhost:4179/',
    reuseExistingServer: true,
  },
});

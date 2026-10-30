import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  timeout: 90000,
  retries: 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://frontend:3000',
    headless: true,
    viewport: { width: 1440, height: 900 },
    locale: 'vi-VN',
    trace: 'retain-on-failure',
  },
  reporter: [['list']],
});

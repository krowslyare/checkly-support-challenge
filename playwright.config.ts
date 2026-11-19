import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.browser.spec.ts', '**/*.multi-step.spec.ts'],
  retries: 0,
  use: { trace: 'retain-on-failure' },
});

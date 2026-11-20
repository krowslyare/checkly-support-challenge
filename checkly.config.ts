import { defineConfig } from 'checkly';

export default defineConfig({
  projectName: 'Checkly monitoring setup',
  logicalId: 'store-and-api-monitoring',
  checks: {
    checkMatch: '__checks__/**/*.check.ts',
    runtimeId: '2026.04',
  },
  cli: {
    runLocation: 'us-east-1',
  },
});

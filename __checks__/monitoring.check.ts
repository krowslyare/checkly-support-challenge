import { AlertEscalationBuilder, CheckGroupV2, EmailAlertChannel, Frequency, type CheckGroupV2Props } from 'checkly/constructs';
import profiles from './api-checks/users.json';
import { createProfileChecks } from './api-checks/profile-checks';

const failureEmail = new EmailAlertChannel('failure-email', {
  address: 'raccoon@checklyhq.com',
  sendFailure: true,
  sendRecovery: false,
  sendDegraded: false,
});

// Hourly keeps usage low until the plan is known. See the README section Frequency and usage.
const sharedSettings = {
  frequency: Frequency.EVERY_1H,
  locations: ['us-east-1'],
  alertChannels: [failureEmail],
  alertEscalationPolicy: AlertEscalationBuilder.runBasedEscalation(1, { interval: 5, amount: 0 }),
} satisfies Omit<CheckGroupV2Props, 'name'>;

// These testMatch patterns resolve relative to this file, so they go up one level to tests/.
new CheckGroupV2('playwright-journeys', {
  ...sharedSettings,
  name: 'Playwright journeys',
  browserChecks: { testMatch: '../tests/**/*.browser.spec.ts' },
  multiStepChecks: { testMatch: '../tests/**/*.multi-step.spec.ts' },
});

const profileGroup = new CheckGroupV2('profile-apis', {
  ...sharedSettings,
  name: 'Profile APIs',
});

createProfileChecks(profiles.users, profileGroup);

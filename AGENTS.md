# Working in this repo

## Find the code

- `tests/` contains the Playwright specs. Use `.browser.spec.ts` for Browser checks and `.multi-step.spec.ts` for Multistep checks.
- `__checks__/monitoring.check.ts` defines the groups, schedule, and failure email. `checkly.config.ts` loads it.
- `__checks__/api-checks/users.json` is the profile list. `profile-checks.ts` turns each user into an API check.

## Check your work

- Use Node.js 24 and run `npm ci`. Start with `npm run test:list`. For `npm test`, use the Chromium setup in the [README](README.md#run-playwright-locally).
- After signing in to Checkly, run `npm run checkly:test -- --list`. The base setup lists five checks.
- Review changes with `npm run checkly:deploy -- --preview`. Deploy when the user asks.
- Keep the raw `PROFILE_API_TOKEN` in Checkly as a secret.
- `npm test` uses Playwright 1.65.1, but Checkly runs the specs with its `2026.04` runtime (Playwright 1.58.2). If a change relies on a newer Playwright feature, confirm it with `npm run checkly:test`, not only `npm test`.
- Keep logical IDs stable (`failure-email`, `playwright-journeys`, `profile-apis`, `profile-<id>`). Changing one makes Checkly delete and recreate that resource, and its history is lost. Browser and Multistep checks use their spec path (for example `tests/pokemon.multi-step.spec.ts`) as the logical ID, so renaming or moving a spec also recreates it.
- If `npm run checkly:test` times out, run it with `-- --detach` and follow the printed session with `npx checkly test-sessions get SESSION_ID --watch`.

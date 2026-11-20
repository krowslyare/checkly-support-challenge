# Checkly monitoring setup

This repo sets up two Playwright checks and three profile checks. Both groups use the same failure email address, `raccoon@checklyhq.com`.

| Group | What it checks |
| --- | --- |
| Playwright journeys | The store test starts at `/products`, checks that Blue Top reaches the cart, and opens signup from checkout. The Pokémon test checks that Pikachu's first form has the `electric` type. |
| Profile APIs | Each URL in [`users.json`](__checks__/api-checks/users.json) returns HTTP 200 and the expected `id` and `name`. |

**Your two tests were close.** A few labels on the site no longer matched, and a couple of checks needed `()` or `await` to run. We've explained each change, with screenshots, in the comments on these commits: [Store fix](https://github.com/krowslyare/checkly-support-challenge/commit/20cac076be8732f628602e53b7d5d30902cf6e9a) · [Cart check](https://github.com/krowslyare/checkly-support-challenge/commit/2d7f2cb7dc44a2b2d8b812a80e678ead4c38cfed) · [Pokémon fix](https://github.com/krowslyare/checkly-support-challenge/commit/834f8f90269b5b9ddd641fe41589f43e4e3707b3) · [Pokémon URL checks](https://github.com/krowslyare/checkly-support-challenge/commit/d918547f479118133dc79e9120138eeb08f35241)

**What we tested.** All five checks passed in Checkly, including the profile checks with the real token, and the full Quick start ran cleanly on macOS and Linux. We also deployed a copy with one check set to fail, and the failure email arrived.

## Quick start

You’ll need Git, Node.js 24, access to this repo, and a Checkly account. [Download Node.js](https://nodejs.org/en/download) · [Run Playwright locally](#run-playwright-locally)

**Using a coding agent?** Paste this into Claude Code, Codex, or any agent that can run commands on your machine:

```text
Clone https://github.com/krowslyare/checkly-support-challenge.git, read its README.md and AGENTS.md, and follow the Quick start up to the deploy preview. Ask me before logging in to Checkly or deploying. When you reach the token step, stop and let me save it myself.
```

### 1. Clone and install

```sh
git clone https://github.com/krowslyare/checkly-support-challenge.git
cd checkly-support-challenge
npm ci
```

### 2. Sign in and save your token

```sh
npx checkly login
```

Then save your API token as a secret in that same account:

```sh
npx checkly env add PROFILE_API_TOKEN --secret
```

When it asks for the value, paste only the token, without `Bearer ` (the checks add it for you). The token isn't shown on screen or saved in your terminal history. To confirm it's there, run `npx checkly env ls`.

<details>
<summary>Prefer the dashboard?</summary>

1. Open [Environment variables](https://app.checklyhq.com/environment-variables).
2. Add a variable with the key `PROFILE_API_TOKEN`.
3. Paste only the token as the value, mark it as **secret**, and save.

[Checkly secrets guide](https://www.checklyhq.com/docs/platform/secrets/)
</details>

### 3. List your checks

```sh
npm run checkly:test -- --list
```

You should see the store test, the Pokémon test, and three profile checks.

### 4. Run the checks in Checkly

```sh
npm run checkly:test
```

This runs all five checks once. Nothing is scheduled yet.

### 5. See what Checkly will create

```sh
npm run checkly:deploy -- --preview
```

On the first deploy, the preview should show five checks, two groups, and one email channel.

### 6. Turn on scheduled checks

When all five checks pass and the preview looks right, run this to start monitoring.

```sh
npm run checkly:deploy
```

## Add a check

- **Playwright.** Save a file ending in `.browser.spec.ts` or `.multi-step.spec.ts` anywhere under `tests/`. Checkly adds it to **Playwright journeys**. **A file ending only in `.spec.ts` is ignored.** [Tests folder](tests/)
- **Profile API.** Add a user with a unique `id`, a `name`, and a `profile_url`. Checkly creates one check for that user. [User list](__checks__/api-checks/users.json)
- **Any other check.** Save a file ending in `.check.ts` anywhere under `__checks__/`, such as a hand-written API check. Checkly picks it up on the next deploy.

To apply the same rules to another list, pass it to `createProfileChecks` with its group and a different ID prefix. [API check generator](__checks__/api-checks/profile-checks.ts)

Run `npm run checkly:test -- --list` to see the new check.

## Run Playwright locally

After cloning and running `npm ci`, install Chromium to run the two Playwright tests on your machine.

**macOS**

```sh
npx playwright install chromium
npm test
```

**Ubuntu or Debian**

```sh
npx playwright install --with-deps chromium
npm test
```

See the supported OS versions in the [Playwright system requirements](https://playwright.dev/docs/intro#system-requirements).

## Frequency and usage

Each check runs once an hour from `us-east-1`, so you'll hear about a failure within about an hour. Before emailing you, Checkly retries a failed check once, so a brief blip on a live site won't trigger an alert.

That's about 720 browser and 4,320 API runs a month plus any retries (each Pokémon request counts as one run), within the free Hobby plan's 1,000 and 10,000. For faster alerts, change `frequency` in [`monitoring.check.ts`](__checks__/monitoring.check.ts). Every 10 minutes is six times the runs, more than Hobby or Starter include, and on Hobby Checkly stops running your checks once the runs are used up. [Checkly pricing](https://www.checklyhq.com/pricing/)

---

Questions, or something not working? Just reply in our chat, happy to help 🦝

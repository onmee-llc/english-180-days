# Daily Mastery

A personal **180-day self-upgrade program** for a senior backend / AI engineer, built as a
static site (Eleventy + Gulp + Rollup + SCSS) and deployed to Firebase Hosting.

Three parallel tracks, taught **bilingually (English + Tiếng Việt)** and tracked day by day:

- **English** — communication for work and daily conversation (including with kids).
- **AI / LLM / ML** — a hands-on engineering roadmap with cost-tagged resources.
- **Finance & Career** — practical personal-finance skills for engineers.

The program starts **22 August 2026** and runs for 180 days. Sign in (Google) to track your
streak and completed lessons across devices.

> Originally forked from the archived [web.dev](https://github.com/GoogleChrome/web.dev)
> codebase; the publishing pipeline and course system are reused as-is.

## Building the site 🏗

Requires [Node](https://nodejs.org/) v14 (LTS) or higher (`node -v`). Use
[nvm](https://github.com/nvm-sh/nvm) if you need to manage versions.

```bash
git clone https://github.com/onmee-llc/daily-mastery.git
cd daily-mastery
npm ci
npm run dev
```

Open `http://localhost:8080/` to preview locally. Changes to assets rebuild the site —
refresh to see them.

### Speeding up builds

Building everything is slow. Create a `.env` file at the project root to scope the build:

```text
# Ignore ALL site content
ELEVENTY_IGNORE=true

# Only build the directories you're working on (JSON string — use double quotes).
ELEVENTY_INCLUDE=["learn"]
```

## Environments 🌳

Set `ELEVENTY_ENV=prod` to force a production build (default for `stage`/`deploy`). If the
build runs out of memory, raise the heap size:

```sh
ELEVENTY_ENV=prod npm --node-options '--max_old_space_size=8192' run build
```

## Deploying 🚀

```sh
npm run build && firebase deploy --only hosting
# plus --only firestore:rules when auth/tracking is enabled
```

Firebase project: `dailymastery`. Auth uses Google sign-in; per-user progress is stored in
Firestore under `users/{uid}`.

## Debugging 🐛

1. Add a `debugger` statement to `.eleventy.js`.
2. Run `npm run debug:eleventy`.
3. Open `about://inspect` to attach to the running process.

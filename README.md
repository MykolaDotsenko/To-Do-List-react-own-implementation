# Orbit — Daily Focus OS

[![Quality](https://github.com/MykolaDotsenko/To-Do-List-react-own-implementation/actions/workflows/quality.yml/badge.svg)](https://github.com/MykolaDotsenko/To-Do-List-react-own-implementation/actions/workflows/quality.yml)

**A local-first daily focus workspace that turns a basic Todo exercise into a polished product and frontend architecture case study.**

**GitHub Pages target:** https://mykoladotsenko.github.io/To-Do-List-react-own-implementation/

Orbit is designed around one small loop:

> **Capture → choose Today → protect a Top 3 → finish → recover → repeat**

The interface deliberately keeps the backlog quiet and the next meaningful action obvious. It runs entirely in the browser, requires no account, and preserves the original project's local-first simplicity while adding a much stronger product model, reliability boundary, responsive UX, and visual system.

## Product capabilities

- fast one-line task capture
- **Today / Next / Later** planning buckets
- 5 / 15 / 30 / 60 minute effort estimates
- deliberately capped **Top 3** focus stack
- Today, Top 3, All, and Done views
- instant task search
- inline editing
- complete / reopen actions
- one-step Undo after deletion
- clear-completed action
- derived daily effort and progress metrics
- versioned local persistence
- migration from the original `todos` localStorage payload
- explicit session-only fallback when browser storage is unavailable
- keyboard shortcuts: `N` for capture and `/` for search
- native View Transition enhancement where supported
- reduced-motion and forced-colors support
- responsive mobile bottom navigation

## Why this project is different

A Todo app is too small to justify a backend, Redux, a component framework, or a complex service layer only for appearance's sake.

Orbit instead spends complexity where it protects real behavior:

```text
React UI
  |
  +--> task domain
  |      ├─ normalization
  |      ├─ reducer transitions
  |      ├─ derived views
  |      └─ progress / effort stats
  |
  +--> storage adapter
         ├─ v2 envelope
         ├─ legacy migration
         └─ failure-safe writes
```

The domain module knows nothing about React, the DOM, localStorage, CSS, or animation. The storage adapter knows nothing about UI state. Views and metrics are derived rather than duplicated.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the dependency rules and trade-offs.

## Stack

### Runtime

- React 18
- Vite 5
- Sass / CSS Modules
- nanoid
- react-icons
- Web Storage API
- native View Transition API as progressive enhancement

### Verification and delivery

- Node.js built-in test runner
- ESLint
- Vite production build
- Playwright
- axe-core
- Lighthouse CI
- GitHub Actions
- GitHub Pages
- Dependabot

Browser and performance tools are **verification-only**. They are pinned and installed transiently by CI so the shipped application keeps the original small runtime dependency surface.

No backend, account, analytics SDK, state library, UI kit, or animation runtime is required.

## UX principles

### 1. Capture without ceremony

The primary input is always close. Metadata is optional but visible, so a task can be captured in seconds without opening a modal.

### 2. Limit focus instead of visualizing infinite priority

Top 3 is intentionally capped. A fourth item cannot become a focus item until one of the current three leaves the stack.

The reducer owns that invariant; the disabled fourth-star control is only a UX affordance.

### 3. Keep metadata lightweight

Orbit stores only enough structure to improve the next decision: when, approximate effort, completion, and focus status.

### 4. Mobile is a first-class workflow

Below 840 px, secondary desktop chrome disappears, search stays available, cards reflow, and task views move into a thumb-friendly bottom navigation surface.

The browser suite also asserts that the Pixel-sized product has no horizontal overflow.

### 5. Motion is progressive enhancement

Modern browsers can use same-document View Transitions for state changes. Core behavior never depends on animation, and `prefers-reduced-motion` disables spatial motion.

## Reliability model

The current storage envelope is:

```json
{
  "version": 2,
  "savedAt": "2026-09-19T12:00:00.000Z",
  "tasks": []
}
```

On startup Orbit:

1. attempts to read the v2 payload;
2. validates and normalizes every record;
3. falls back to the original `todos` payload when present;
4. drops malformed entries instead of crashing the app;
5. writes the normalized current model on the next state change.

Storage access itself is resolved **inside** the failure boundary. If browser policy throws while resolving or writing localStorage, Orbit remains usable for the current session and reports that persistence is unavailable.

## Quality evidence

### Fast deterministic gate

```bash
npm ci
npm run check
```

This runs:

1. ESLint with zero warnings
2. domain and storage boundary tests
3. production Vite build

Unit tests cover:

- legacy task normalization
- Top-3 invariant
- search/view derivation
- progress and effort metrics
- current storage envelope
- legacy storage migration
- malformed payload fallback
- blocked storage writes

### Browser matrix

Pull requests also run the real production build through:

- Chromium desktop
- Firefox desktop
- WebKit desktop
- Pixel 7 / mobile Chromium

The suite verifies:

- capture → Top 3 → complete → reopen
- the three-task focus cap
- Undo after deletion
- persistence after reload
- keyboard shortcuts
- blocked-storage session fallback
- mobile bottom navigation
- mobile horizontal-overflow regression
- reduced-motion behavior

### Accessibility

axe scans the initial and populated product states against automated WCAG A/AA rules.

Automated accessibility checks do not replace manual assistive-technology testing; they make common regressions much harder to merge unnoticed.

### Performance budgets

Lighthouse CI runs three production-build passes and enforces:

| Category | Gate |
| --- | ---: |
| Performance | ≥ 90 |
| Accessibility | **100** |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| CLS | ≤ 0.10 |
| Total Blocking Time | ≤ 200 ms |
| JavaScript transfer | ≤ 250 KB |
| CSS transfer | ≤ 100 KB |
| Runtime third-party requests | **0** |

First Contentful Paint and Largest Contentful Paint also have warning budgets so performance drift stays visible without making CI unnecessarily flaky.

### Visual evidence

CI creates deterministic desktop Chromium and Pixel 7 screenshots from a fixed clock and seeded task set. Browser traces, failure screenshots/videos, the HTML report, generated portfolio screenshots, and Lighthouse output are retained as short-lived workflow artifacts.

## Deployment

GitHub Pages builds from `main` through the official Pages Actions flow.

The production build receives:

```text
VITE_BASE_PATH=/To-Do-List-react-own-implementation/
```

Local development keeps the normal root base path, so deployment-specific routing does not leak into application logic.

## Local development

```bash
npm ci
npm run dev
```

Then open the Vite URL shown in the terminal.

To reproduce the CI browser suite locally without changing the committed dependency graph:

```bash
npm install --no-save --package-lock=false \
  @playwright/test@1.63.0 \
  @axe-core/playwright@4.13.0 \
  @lhci/cli@0.15.1

npx playwright install chromium firefox webkit
npm run build
npx playwright test
npx lhci autorun --config=./lighthouserc.json
```

## Recruiter walkthrough

For a fast technical review:

1. [`src/domain/taskModel.js`](./src/domain/taskModel.js) — pure product rules and reducer
2. [`src/storage/taskStorage.js`](./src/storage/taskStorage.js) — versioned persistence and failure boundary
3. [`src/components/Todolist.jsx`](./src/components/Todolist.jsx) — composition, derived state, shortcuts, recovery
4. [`src/components/TodoCard.jsx`](./src/components/TodoCard.jsx) — accessible task interaction
5. [`src/components/TodoList.module.scss`](./src/components/TodoList.module.scss) — responsive visual system
6. [`tests/taskModel.test.js`](./tests/taskModel.test.js) — domain regression tests
7. [`tests/taskStorage.test.js`](./tests/taskStorage.test.js) — persistence boundary tests
8. [`e2e/orbit.spec.js`](./e2e/orbit.spec.js) — product browser journeys
9. [`e2e/accessibility.spec.js`](./e2e/accessibility.spec.js) — WCAG automation
10. [`.github/workflows/quality.yml`](./.github/workflows/quality.yml) — static, browser, accessibility and Lighthouse gates

## Product positioning

Orbit is intentionally a **premium prototype**, not a fake SaaS. There is no pretend cloud sync, collaboration, billing, or AI feature without the backend those capabilities would actually require.

The portfolio signal is the opposite: a small product with disciplined scope, a distinctive user experience, explicit architecture, graceful failure handling, responsive interaction design, and automated evidence that the critical workflow still works.

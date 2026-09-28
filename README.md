# Orbit — Daily Focus

Orbit is a small React workspace for deciding **what matters today**, not for managing an endless backlog.

[**Live demo**](https://orbit-daily-focus.vercel.app/) · [Architecture notes](./ARCHITECTURE.md)

The core loop is simple:

```text
Capture → Today → Top 3 → finish → repeat
```

## What Orbit does

- **Today / Next / Later** planning
- a hard **Top 3** focus limit
- 5 / 15 / 30 / 60 minute effort estimates
- Today, Top 3, All and Done views
- instant search
- inline editing
- complete / reopen
- delete with one-step Undo
- daily effort and progress totals
- keyboard shortcuts: `N` to capture, `/` to search
- responsive bottom navigation on mobile
- reduced-motion and forced-colors support

The app runs entirely in the browser and keeps its state locally.

## Why Top 3 is a rule, not a label

The focus list is capped at three tasks.

A fourth task cannot be starred until one of the current three leaves the set. That limit lives in the task reducer, so the UI is not responsible for enforcing it.

This is the main product choice in Orbit: the backlog can be large, but the focus surface cannot.

## Local state that can survive change

Orbit started as a much simpler Todo exercise, so the current storage layer also handles older data.

Current state is saved in a versioned envelope:

```json
{
  "version": 2,
  "savedAt": "2026-09-19T12:00:00.000Z",
  "tasks": []
}
```

On startup the app:

1. reads the current payload;
2. validates and normalizes every task;
3. migrates the original `todos` payload when needed;
4. drops malformed records instead of failing the whole app;
5. continues in session-only mode if browser storage is blocked.

That last case is intentional: losing persistence should not make the task UI unusable.

## Frontend structure

```text
React UI
   │
   ├── task domain
   │     ├── normalization
   │     ├── reducer transitions
   │     ├── derived views
   │     └── progress / effort calculations
   │
   └── storage adapter
         ├── versioned payload
         ├── legacy migration
         └── failure-safe reads / writes
```

Task rules do not depend on React or the DOM. Storage is kept behind its own adapter. Search results, progress and view subsets are derived from the task model rather than stored as parallel state.

For this size of app, that separation is enough. The interface stays simple without pushing domain rules into components.

## Interaction details

A few small decisions make Orbit feel less like a tutorial Todo app:

- capture stays close to the current view instead of hiding behind a modal;
- task metadata is optional;
- mobile navigation moves to the bottom of the screen;
- View Transitions are used only when the browser supports them;
- spatial animation is disabled when `prefers-reduced-motion` is set;
- the mobile browser suite checks for horizontal overflow.

## Stack

**React 18 · Vite 5 · JavaScript · Sass / CSS Modules · Web Storage**

Also used:

- nanoid
- react-icons
- Playwright
- axe-core
- Lighthouse CI
- ESLint
- GitHub Actions

## Checks

```bash
npm ci
npm run check
```

The repository checks:

- task normalization and reducer behaviour
- the Top 3 invariant
- search and progress calculations
- storage migration and malformed payloads
- blocked-storage fallback
- production build
- Chromium, Firefox and WebKit journeys
- Pixel-sized mobile behaviour
- accessibility with axe
- Lighthouse performance budgets

Current Lighthouse gates include:

| Check | Gate |
| --- | ---: |
| Performance | ≥ 90 |
| Accessibility | 100 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |
| CLS | ≤ 0.10 |
| Total Blocking Time | ≤ 200 ms |

## Run locally

```bash
npm ci
npm run dev
```

Open the Vite URL shown in the terminal.

## From Todo exercise to Orbit

The first version of this repository was a basic React Todo exercise.

I kept the small local-first foundation and rebuilt the parts that made the project more interesting to work on:

- task planning instead of a single flat list;
- a real focus constraint;
- versioned persistence and migration;
- storage failure handling;
- mobile navigation;
- keyboard interaction;
- accessibility checks;
- browser-level regression tests;
- performance budgets.

The code still reflects the original learning project, but the current app is now focused on one specific problem: **choosing a manageable set of tasks for today and getting through them.**

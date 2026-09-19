# Orbit — Daily Focus OS

**A local-first daily focus workspace that turns a basic Todo exercise into a polished product and frontend architecture case study.**

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
- explicit session-only warning if browser storage is unavailable
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

### Verification

- Node.js built-in test runner
- ESLint
- Vite production build
- GitHub Actions

No backend, account, analytics SDK, state library, UI kit, or animation runtime is required.

## UX principles

### 1. Capture without ceremony

The primary input is always close. Metadata is optional but visible, so a task can be captured in seconds without opening a modal.

### 2. Limit focus instead of visualizing infinite priority

Top 3 is intentionally capped. A fourth item cannot become a focus item until one of the current three leaves the stack.

### 3. Keep metadata lightweight

Orbit stores only enough structure to improve the next decision: when, approximate effort, completion, and focus status.

### 4. Mobile is a first-class workflow

Below 840 px, secondary desktop chrome disappears, search stays available, cards reflow, and task views move into a thumb-friendly bottom navigation surface.

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

If localStorage is blocked, the app remains usable for the current session and says so explicitly.

## Quality checks

```bash
npm install
npm run check
```

The gate runs:

1. ESLint
2. Node domain tests
3. production Vite build

The tests currently verify legacy normalization, the Top-3 invariant, derived filtering/search ordering, and progress/effort calculations.

## Local development

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## Recruiter walkthrough

For a fast technical review:

1. [`src/domain/taskModel.js`](./src/domain/taskModel.js) — pure product rules and reducer
2. [`src/storage/taskStorage.js`](./src/storage/taskStorage.js) — versioned persistence boundary
3. [`src/components/Todolist.jsx`](./src/components/Todolist.jsx) — composition, derived state, shortcuts, recovery
4. [`src/components/TodoCard.jsx`](./src/components/TodoCard.jsx) — accessible task interaction
5. [`src/components/TodoList.module.scss`](./src/components/TodoList.module.scss) — responsive visual system
6. [`tests/taskModel.test.js`](./tests/taskModel.test.js) — regression tests for domain invariants
7. [`.github/workflows/quality.yml`](./.github/workflows/quality.yml) — automated gate

## Product positioning

Orbit is intentionally a **premium prototype**, not a fake SaaS. There is no pretend cloud sync, collaboration, billing, or AI feature without the backend those capabilities would actually require.

The portfolio signal is the opposite: a small product with disciplined scope, a distinctive user experience, explicit architecture, graceful failure handling, responsive interaction design, and code that remains understandable in one sitting.

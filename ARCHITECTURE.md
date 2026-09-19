# Orbit architecture

## Goal

Keep a small product small while protecting the behaviors that are easy to break: task migration, focus limits, derived views, persistence failures, and responsive interaction state.

## Dependency direction

```text
components / React composition
          |
          v
     taskModel.js

components / React composition
          |
          v
    taskStorage.js
          |
          v
   browser localStorage
```

`taskModel.js` imports no React or browser APIs.

## Canonical state

The canonical application state is one task array. Search results, counts, progress, Today effort, and the Top-3 stack are derived.

This avoids synchronization bugs such as maintaining separate `todayTasks`, `completedTasks`, and `focusTasks` collections.

## Task model

```text
id
title
completed
favorite      // Top-3 membership; legacy field retained for migration compatibility
bucket        // today | next | later
estimate      // 5 | 15 | 30 | 60 minutes
createdAt
updatedAt
```

The persisted property remains `favorite` so original data can migrate without a lossy rename step. In the product language this field means **Top 3 / focus**.

## Focus invariant

At most three incomplete tasks may be in the focus stack. The reducer owns this invariant; UI disabling is only an affordance.

This matters because invariants should survive alternative callers, not depend on a button staying disabled.

## Persistence boundary

Storage uses a versioned envelope under `orbit.tasks.v2` and can read the original `todos` array.

Malformed payloads fail closed to an empty list. A storage exception never prevents the application from running; the UI reports that the session is non-persistent.

## View transitions

`document.startViewTransition()` is optional progressive enhancement. Reducer behavior is identical when the API is missing or the user requests reduced motion.

## Rejected complexity

Orbit intentionally does not add:

- Redux or another global state library
- router
- backend or fake API
- drag-and-drop runtime
- animation package
- design-system dependency
- repository/service/facade layers that only proxy localStorage

Those can be introduced later only when a concrete requirement justifies them.

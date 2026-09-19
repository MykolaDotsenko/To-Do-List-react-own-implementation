import { normalizeTask } from '../domain/taskModel.js'

export const STORAGE_KEY = 'orbit.tasks.v2'
export const LEGACY_STORAGE_KEY = 'todos'
export const STORAGE_VERSION = 2

function parseTasks(value) {
  if (!Array.isArray(value)) return []

  return value
    .map((task, index) => normalizeTask(task, `legacy-${index}`))
    .filter(Boolean)
}

function resolveStorage(storage) {
  return storage ?? window.localStorage
}

export function loadTasks(storage) {
  try {
    const target = resolveStorage(storage)
    const stored = target.getItem(STORAGE_KEY)

    if (stored) {
      const payload = JSON.parse(stored)
      if (payload?.version === STORAGE_VERSION) return parseTasks(payload.tasks)
    }

    const legacy = target.getItem(LEGACY_STORAGE_KEY)
    if (legacy) return parseTasks(JSON.parse(legacy))
  } catch {
    return []
  }

  return []
}

export function saveTasks(tasks, storage) {
  try {
    const target = resolveStorage(storage)

    target.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        savedAt: new Date().toISOString(),
        tasks,
      }),
    )

    return true
  } catch {
    return false
  }
}

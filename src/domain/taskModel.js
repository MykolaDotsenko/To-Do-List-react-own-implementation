export const MAX_FOCUS_TASKS = 3
export const VALID_BUCKETS = ['today', 'next', 'later']
export const VALID_ESTIMATES = [5, 15, 30, 60]

const bucketOrder = { today: 0, next: 1, later: 2 }

export function sanitizeTitle(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 160)
}

export function normalizeTask(raw, fallbackId = '') {
  if (!raw || typeof raw !== 'object') return null

  const title = sanitizeTitle(raw.title)
  if (!title) return null

  const bucket = VALID_BUCKETS.includes(raw.bucket) ? raw.bucket : 'today'
  const estimate = VALID_ESTIMATES.includes(Number(raw.estimate)) ? Number(raw.estimate) : 15
  const createdAt = typeof raw.createdAt === 'string' && raw.createdAt ? raw.createdAt : new Date(0).toISOString()
  const updatedAt = typeof raw.updatedAt === 'string' && raw.updatedAt ? raw.updatedAt : createdAt

  return {
    id: String(raw.id || fallbackId),
    title,
    completed: Boolean(raw.completed),
    favorite: Boolean(raw.favorite ?? raw.focus),
    bucket,
    estimate,
    createdAt,
    updatedAt,
  }
}

export function createTask({ id, title, bucket = 'today', estimate = 15, now = new Date().toISOString() }) {
  const normalizedTitle = sanitizeTitle(title)
  if (!normalizedTitle) return null

  return normalizeTask(
    {
      id,
      title: normalizedTitle,
      completed: false,
      favorite: false,
      bucket,
      estimate,
      createdAt: now,
      updatedAt: now,
    },
    id,
  )
}

function updateTask(tasks, id, updater) {
  return tasks.map((task) => (task.id === id ? updater(task) : task))
}

export function taskReducer(tasks, action) {
  switch (action.type) {
    case 'add':
      return action.task ? [action.task, ...tasks] : tasks

    case 'toggle-complete': {
      const activeFocusCount = tasks.filter((task) => task.favorite && !task.completed).length
      return updateTask(tasks, action.id, (task) => {
        const completed = !task.completed
        const wouldOverflowFocus = !completed && task.favorite && activeFocusCount >= MAX_FOCUS_TASKS
        return {
          ...task,
          completed,
          favorite: wouldOverflowFocus ? false : task.favorite,
          updatedAt: action.now,
        }
      })
    }

    case 'toggle-focus': {
      const current = tasks.find((task) => task.id === action.id)
      if (!current) return tasks

      const focusCount = tasks.filter((task) => task.favorite && !task.completed).length
      if (!current.favorite && focusCount >= MAX_FOCUS_TASKS) return tasks

      return updateTask(tasks, action.id, (task) => ({
        ...task,
        favorite: !task.favorite,
        updatedAt: action.now,
      }))
    }

    case 'rename': {
      const title = sanitizeTitle(action.title)
      if (!title) return tasks
      return updateTask(tasks, action.id, (task) => ({ ...task, title, updatedAt: action.now }))
    }

    case 'set-bucket':
      if (!VALID_BUCKETS.includes(action.bucket)) return tasks
      return updateTask(tasks, action.id, (task) => ({ ...task, bucket: action.bucket, updatedAt: action.now }))

    case 'set-estimate':
      if (!VALID_ESTIMATES.includes(Number(action.estimate))) return tasks
      return updateTask(tasks, action.id, (task) => ({ ...task, estimate: Number(action.estimate), updatedAt: action.now }))

    case 'delete':
      return tasks.filter((task) => task.id !== action.id)

    case 'restore':
      return action.task ? [action.task, ...tasks.filter((task) => task.id !== action.task.id)] : tasks

    case 'clear-completed':
      return tasks.filter((task) => !task.completed)

    default:
      return tasks
  }
}

export function getTaskStats(tasks) {
  const total = tasks.length
  const completed = tasks.filter((task) => task.completed).length
  const active = total - completed
  const focus = tasks.filter((task) => task.favorite && !task.completed).length
  const today = tasks.filter((task) => task.bucket === 'today' && !task.completed).length
  const minutes = tasks
    .filter((task) => task.bucket === 'today' && !task.completed)
    .reduce((sum, task) => sum + task.estimate, 0)

  return {
    total,
    completed,
    active,
    focus,
    today,
    minutes,
    progress: total ? Math.round((completed / total) * 100) : 0,
  }
}

export function deriveTasks(tasks, { view = 'today', query = '' } = {}) {
  const normalizedQuery = sanitizeTitle(query).toLocaleLowerCase()

  return tasks
    .filter((task) => {
      if (normalizedQuery && !task.title.toLocaleLowerCase().includes(normalizedQuery)) return false

      if (view === 'focus') return task.favorite && !task.completed
      if (view === 'completed') return task.completed
      if (view === 'all') return true
      return task.bucket === 'today' && !task.completed
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed)
      if (a.favorite !== b.favorite) return Number(b.favorite) - Number(a.favorite)
      if (bucketOrder[a.bucket] !== bucketOrder[b.bucket]) return bucketOrder[a.bucket] - bucketOrder[b.bucket]
      return b.createdAt.localeCompare(a.createdAt)
    })
}

export function getFocusStack(tasks) {
  return tasks
    .filter((task) => task.favorite && !task.completed)
    .sort((a, b) => bucketOrder[a.bucket] - bucketOrder[b.bucket] || a.createdAt.localeCompare(b.createdAt))
    .slice(0, MAX_FOCUS_TASKS)
}

import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_FOCUS_TASKS,
  createTask,
  deriveTasks,
  getTaskStats,
  normalizeTask,
  taskReducer,
} from '../src/domain/taskModel.js'

const now = '2026-09-19T12:00:00.000Z'

function task(id, overrides = {}) {
  return createTask({ id, title: `Task ${id}`, now, ...overrides })
}

test('normalizes legacy todos into the current model', () => {
  const result = normalizeTask({ id: '1', title: '  Ship   it  ', completed: 1, favorite: true })
  assert.equal(result.title, 'Ship it')
  assert.equal(result.bucket, 'today')
  assert.equal(result.estimate, 15)
  assert.equal(result.completed, true)
  assert.equal(result.favorite, true)
})

test('focus stack is capped at three tasks', () => {
  let tasks = [task('a'), task('b'), task('c'), task('d')]

  for (const id of ['a', 'b', 'c', 'd']) {
    tasks = taskReducer(tasks, { type: 'toggle-focus', id, now })
  }

  assert.equal(tasks.filter((item) => item.favorite).length, MAX_FOCUS_TASKS)
  assert.equal(tasks.find((item) => item.id === 'd').favorite, false)
})

test('deriveTasks applies view, search, and stable product ordering', () => {
  const tasks = [
    { ...task('a', { title: 'Write proposal', bucket: 'today' }), favorite: true },
    task('b', { title: 'Read notes', bucket: 'today' }),
    task('c', { title: 'Later idea', bucket: 'later' }),
  ]

  assert.deepEqual(
    deriveTasks(tasks, { view: 'today', query: 'write' }).map((item) => item.id),
    ['a'],
  )
})

test('stats derive progress and today effort without duplicate state', () => {
  const tasks = [
    { ...task('a', { estimate: 30 }), completed: true },
    task('b', { estimate: 15 }),
    task('c', { bucket: 'next', estimate: 60 }),
  ]

  assert.deepEqual(getTaskStats(tasks), {
    total: 3,
    completed: 1,
    active: 2,
    focus: 0,
    today: 1,
    minutes: 15,
    progress: 33,
  })
})

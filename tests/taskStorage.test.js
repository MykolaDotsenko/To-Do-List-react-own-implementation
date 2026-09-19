import test from 'node:test'
import assert from 'node:assert/strict'
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  STORAGE_VERSION,
  loadTasks,
  saveTasks,
} from '../src/storage/taskStorage.js'

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed))

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null
    },
    setItem(key, value) {
      values.set(key, value)
    },
    read(key) {
      return values.get(key)
    },
  }
}

test('loads a valid current-version payload', () => {
  const storage = memoryStorage({
    [STORAGE_KEY]: JSON.stringify({
      version: STORAGE_VERSION,
      tasks: [{ id: 'a', title: 'Current task', completed: false }],
    }),
  })

  const tasks = loadTasks(storage)
  assert.equal(tasks.length, 1)
  assert.equal(tasks[0].title, 'Current task')
})

test('migrates the original todos payload', () => {
  const storage = memoryStorage({
    [LEGACY_STORAGE_KEY]: JSON.stringify([
      { id: 'legacy', title: 'Legacy task', favorite: true, completed: false },
    ]),
  })

  const tasks = loadTasks(storage)
  assert.equal(tasks.length, 1)
  assert.equal(tasks[0].id, 'legacy')
  assert.equal(tasks[0].favorite, true)
  assert.equal(tasks[0].bucket, 'today')
})

test('malformed storage fails closed', () => {
  const storage = memoryStorage({ [STORAGE_KEY]: '{not-json' })
  assert.deepEqual(loadTasks(storage), [])
})

test('write failures return false instead of throwing', () => {
  const storage = {
    setItem() {
      throw new Error('storage blocked')
    },
  }

  assert.equal(saveTasks([], storage), false)
})

test('successful writes use the versioned envelope', () => {
  const storage = memoryStorage()
  assert.equal(saveTasks([{ id: 'a', title: 'Saved task' }], storage), true)

  const payload = JSON.parse(storage.read(STORAGE_KEY))
  assert.equal(payload.version, STORAGE_VERSION)
  assert.equal(payload.tasks[0].title, 'Saved task')
  assert.equal(typeof payload.savedAt, 'string')
})

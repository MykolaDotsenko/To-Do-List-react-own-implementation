import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import { FiCheck, FiCommand, FiRotateCcw, FiTrash2 } from 'react-icons/fi'
import { AddForm } from './AddForm'
import { Filter } from './Filter'
import { FocusPanel } from './FocusPanel'
import { List } from './List'
import { createTask, deriveTasks, getFocusStack, getTaskStats, taskReducer } from '../domain/taskModel.js'
import { loadTasks, saveTasks } from '../storage/taskStorage.js'
import s from './TodoList.module.scss'

function nowIso() {
  return new Date().toISOString()
}

function runViewTransition(update) {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion && document.startViewTransition) {
    document.startViewTransition(update)
    return
  }
  update()
}

export const Todolist = () => {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, loadTasks)
  const [view, setView] = useState('today')
  const [query, setQuery] = useState('')
  const [undoTask, setUndoTask] = useState(null)
  const [storageHealthy, setStorageHealthy] = useState(true)
  const captureRef = useRef(null)
  const searchRef = useRef(null)

  const stats = useMemo(() => getTaskStats(tasks), [tasks])
  const visibleTasks = useMemo(() => deriveTasks(tasks, { view, query }), [tasks, view, query])
  const focusStack = useMemo(() => getFocusStack(tasks), [tasks])

  const counts = useMemo(() => ({
    today: tasks.filter((task) => task.bucket === 'today' && !task.completed).length,
    focus: tasks.filter((task) => task.favorite && !task.completed).length,
    all: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
  }), [tasks])

  useEffect(() => {
    setStorageHealthy(saveTasks(tasks))
  }, [tasks])

  useEffect(() => {
    const handleShortcut = (event) => {
      const target = event.target
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
      if (typing) return

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        captureRef.current?.focus()
      }

      if (event.key === '/') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  useEffect(() => {
    if (!undoTask) return undefined
    const timeout = window.setTimeout(() => setUndoTask(null), 6500)
    return () => window.clearTimeout(timeout)
  }, [undoTask])

  const mutate = (action) => runViewTransition(() => dispatch({ ...action, now: nowIso() }))

  const handleAdd = ({ title, bucket, estimate }) => {
    const task = createTask({ id: nanoid(), title, bucket, estimate, now: nowIso() })
    mutate({ type: 'add', task })
    setView(bucket === 'today' ? 'today' : 'all')
    setQuery('')
  }

  const handleDelete = (id) => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return
    setUndoTask(task)
    mutate({ type: 'delete', id })
  }

  const handleUndo = () => {
    if (!undoTask) return
    mutate({ type: 'restore', task: undoTask })
    setUndoTask(null)
  }

  const formattedDate = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <div className={s.appShell}>
      <header className={s.topbar}>
        <a className={s.brand} href="#main-content" aria-label="Orbit home">
          <span className={s.brandMark} aria-hidden="true"><span /></span>
          <span><strong>Orbit</strong><small>Daily Focus OS</small></span>
        </a>
        <div className={s.topbarMeta}>
          <span>{formattedDate}</span>
          <span className={s.systemStatus}><i /> Local-first</span>
        </div>
      </header>

      <div className={s.layout}>
        <aside className={s.sidebar}>
          <div className={s.sidebarIntro}>
            <span className={s.eyebrow}>Command center</span>
            <h1>Make today feel lighter.</h1>
            <p>Capture everything. Protect only what matters now.</p>
          </div>

          <Filter
            view={view}
            onViewChange={setView}
            query={query}
            onQueryChange={setQuery}
            counts={counts}
            searchRef={searchRef}
          />

          <div className={s.sidebarFooter}>
            <span><FiCommand aria-hidden="true" /> Shortcuts</span>
            <p><kbd>N</kbd> capture · <kbd>/</kbd> search</p>
          </div>
        </aside>

        <main id="main-content" className={s.mainColumn}>
          <section className={s.hero}>
            <div>
              <span className={s.heroKicker}>A calmer operating system for your day</span>
              <h2>Move from <em>busy</em> to <span>clear.</span></h2>
              <p>Orbit keeps the backlog quiet and the next meaningful action obvious.</p>
            </div>

            <div className={s.heroStats} aria-label="Daily summary">
              <article>
                <strong>{stats.today}</strong>
                <span>today</span>
              </article>
              <article>
                <strong>{stats.minutes}</strong>
                <span>min planned</span>
              </article>
              <article>
                <strong>{stats.focus}/3</strong>
                <span>focus slots</span>
              </article>
            </div>
          </section>

          {!storageHealthy && (
            <div className={s.warningBanner} role="status">
              Browser storage is unavailable. Orbit will keep working for this session, but changes may not survive a reload.
            </div>
          )}

          <AddForm onAdd={handleAdd} inputRef={captureRef} />

          <List
            tasks={visibleTasks}
            view={view}
            focusCount={stats.focus}
            onCaptureFocus={() => captureRef.current?.focus()}
            onToggleComplete={(id) => mutate({ type: 'toggle-complete', id })}
            onToggleFocus={(id) => mutate({ type: 'toggle-focus', id })}
            onRename={(id, title) => mutate({ type: 'rename', id, title })}
            onSetBucket={(id, bucket) => mutate({ type: 'set-bucket', id, bucket })}
            onSetEstimate={(id, estimate) => mutate({ type: 'set-estimate', id, estimate })}
            onDelete={handleDelete}
          />

          {stats.completed > 0 && (
            <button type="button" className={s.clearButton} onClick={() => mutate({ type: 'clear-completed' })}>
              <FiTrash2 aria-hidden="true" /> Clear {stats.completed} completed
            </button>
          )}
        </main>

        <FocusPanel
          stack={focusStack}
          progress={stats.progress}
          onComplete={(id) => mutate({ type: 'toggle-complete', id })}
          onOpenFocus={() => setView('all')}
        />
      </div>

      <nav className={s.mobileNav} aria-label="Mobile task views">
        {[
          ['today', 'Today'],
          ['focus', 'Top 3'],
          ['all', 'All'],
          ['completed', 'Done'],
        ].map(([id, label]) => (
          <button key={id} type="button" className={view === id ? s.mobileNavActive : ''} onClick={() => setView(id)}>
            <span>{counts[id]}</span>{label}
          </button>
        ))}
      </nav>

      {undoTask && (
        <div className={s.toast} role="status">
          <span><FiCheck aria-hidden="true" /> Task removed</span>
          <button type="button" onClick={handleUndo}><FiRotateCcw aria-hidden="true" /> Undo</button>
        </div>
      )}
    </div>
  )
}

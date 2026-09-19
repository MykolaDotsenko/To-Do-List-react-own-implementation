import { useEffect, useRef, useState } from 'react'
import { FiClock, FiEdit3, FiStar, FiTrash2, FiX } from 'react-icons/fi'
import s from './TodoList.module.scss'

const bucketLabels = { today: 'Today', next: 'Next', later: 'Later' }

export const TodoCard = ({
  item,
  canPin,
  onToggleComplete,
  onToggleFocus,
  onRename,
  onSetBucket,
  onSetEstimate,
  onDelete,
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.title)
  const editRef = useRef(null)

  useEffect(() => {
    if (editing) {
      editRef.current?.focus()
      editRef.current?.select()
    }
  }, [editing])

  const saveEdit = () => {
    if (draft.trim() && draft.trim() !== item.title) onRename(item.id, draft)
    else setDraft(item.title)
    setEditing(false)
  }

  const handleEditKeyDown = (event) => {
    if (event.key === 'Enter') saveEdit()
    if (event.key === 'Escape') {
      setDraft(item.title)
      setEditing(false)
    }
  }

  return (
    <li
      className={`${s.taskCard} ${item.completed ? s.taskCardCompleted : ''} ${item.favorite ? s.taskCardFocus : ''}`}
      style={{ viewTransitionName: `task-${item.id}` }}
    >
      <label className={s.checkControl}>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggleComplete(item.id)}
          aria-label={`Mark ${item.title} ${item.completed ? 'active' : 'complete'}`}
        />
        <span aria-hidden="true" />
      </label>

      <div className={s.taskBody}>
        {editing ? (
          <div className={s.editRow}>
            <input
              ref={editRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleEditKeyDown}
              maxLength={160}
              aria-label={`Edit ${item.title}`}
            />
            <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => setEditing(false)} aria-label="Cancel editing">
              <FiX aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button type="button" className={s.taskTitleButton} onClick={() => setEditing(true)}>
            <span className={s.taskTitle}>{item.title}</span>
          </button>
        )}

        <div className={s.taskMeta}>
          <label>
            <span className={s.srOnly}>Schedule for {item.title}</span>
            <select value={item.bucket} onChange={(event) => onSetBucket(item.id, event.target.value)}>
              {Object.entries(bucketLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          <label className={s.timeSelect}>
            <FiClock aria-hidden="true" />
            <span className={s.srOnly}>Estimated time for {item.title}</span>
            <select value={item.estimate} onChange={(event) => onSetEstimate(item.id, Number(event.target.value))}>
              {[5, 15, 30, 60].map((minutes) => <option key={minutes} value={minutes}>{minutes} min</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className={s.taskActions}>
        <button
          type="button"
          className={item.favorite ? s.iconButtonActive : s.iconButton}
          onClick={() => onToggleFocus(item.id)}
          disabled={!canPin && !item.favorite}
          aria-pressed={item.favorite}
          aria-label={item.favorite ? `Remove ${item.title} from Top 3` : `Add ${item.title} to Top 3`}
          title={!canPin && !item.favorite ? 'Top 3 is full' : 'Toggle Top 3'}
        >
          <FiStar aria-hidden="true" />
        </button>
        <button type="button" className={s.iconButton} onClick={() => setEditing(true)} aria-label={`Edit ${item.title}`}>
          <FiEdit3 aria-hidden="true" />
        </button>
        <button type="button" className={`${s.iconButton} ${s.dangerButton}`} onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`}>
          <FiTrash2 aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}

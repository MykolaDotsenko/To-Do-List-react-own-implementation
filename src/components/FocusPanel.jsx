import { FiArrowRight, FiCheck, FiClock, FiStar, FiZap } from 'react-icons/fi'
import s from './TodoList.module.scss'

export const FocusPanel = ({ stack, progress, onComplete, onOpenFocus }) => {
  const next = stack[0]

  return (
    <aside className={s.focusPanel} aria-labelledby="focus-panel-title">
      <div className={s.focusPanelTop}>
        <span className={s.eyebrow}>Pinned for today</span>
        <div className={s.progressOrb} style={{ '--progress': `${progress * 3.6}deg` }} aria-label={`${progress}% complete`}>
          <span>{progress}</span>
          <small>%</small>
        </div>
      </div>

      <h2 id="focus-panel-title">The three that stay visible.</h2>

      {next ? (
        <>
          <div className={s.nextTask}>
            <div className={s.nextTaskIcon}><FiZap aria-hidden="true" /></div>
            <span className={s.nextTaskLabel}>Start here</span>
            <strong>{next.title}</strong>
            <span className={s.nextTaskMeta}><FiClock aria-hidden="true" /> {next.estimate} min · {next.bucket}</span>
          </div>

          <button type="button" className={s.focusAction} onClick={() => onComplete(next.id)}>
            Done for now <FiCheck aria-hidden="true" />
          </button>
        </>
      ) : (
        <div className={s.focusEmpty}>
          <FiStar aria-hidden="true" />
          <strong>Nothing pinned yet.</strong>
          <p>Star up to three tasks and keep them in sight for today.</p>
          <button type="button" onClick={onOpenFocus}>Open all tasks <FiArrowRight aria-hidden="true" /></button>
        </div>
      )}

      {stack.length > 1 && (
        <ol className={s.focusStack} aria-label="Focus queue">
          {stack.slice(1).map((task, index) => (
            <li key={task.id}>
              <span>0{index + 2}</span>
              <p>{task.title}</p>
            </li>
          ))}
        </ol>
      )}

      <div className={s.focusHint}>
        <span>Three pins, no fourth.</span>
        <span>Clear one before pinning something else.</span>
      </div>
    </aside>
  )
}

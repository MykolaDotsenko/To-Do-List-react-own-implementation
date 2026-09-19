import { FiArrowUpRight, FiCheckCircle } from 'react-icons/fi'
import { TodoCard } from './TodoCard'
import s from './TodoList.module.scss'

const copy = {
  today: ['Today', 'Keep the surface small. Finish what is already in orbit.'],
  focus: ['Top 3', 'Three deliberate priorities beat a wall of urgency.'],
  all: ['All tasks', 'Everything captured, without losing the signal.'],
  completed: ['Completed', 'Proof that progress compounds.'],
}

export const List = ({ tasks, view, focusCount, onCaptureFocus, ...handlers }) => {
  const [title, subtitle] = copy[view] ?? copy.today

  return (
    <section className={s.listSection} aria-labelledby="task-list-title">
      <div className={s.listHeading}>
        <div>
          <span className={s.eyebrow}>Task stream</span>
          <h2 id="task-list-title">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span className={s.resultCount}>{tasks.length} visible</span>
      </div>

      {tasks.length ? (
        <ul className={s.taskList}>
          {tasks.map((item) => (
            <TodoCard
              key={item.id}
              item={item}
              canPin={focusCount < 3}
              {...handlers}
            />
          ))}
        </ul>
      ) : (
        <div className={s.emptyState}>
          <div className={s.emptyIcon}><FiCheckCircle aria-hidden="true" /></div>
          <h3>Nothing is asking for attention here.</h3>
          <p>Capture one meaningful next action instead of rebuilding a huge backlog.</p>
          <button type="button" className={s.ghostButton} onClick={onCaptureFocus}>
            Capture a task <FiArrowUpRight aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}

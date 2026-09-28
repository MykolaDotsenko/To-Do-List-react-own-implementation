import { FiArrowUpRight, FiCheckCircle } from 'react-icons/fi'
import { TodoCard } from './TodoCard'
import s from './TodoList.module.scss'

const copy = {
  today: ['Today', 'Tasks scheduled for today.'],
  focus: ['Top 3', 'Your protected priorities.'],
  all: ['All tasks', 'Everything you have captured.'],
  completed: ['Done', 'Completed tasks.'],
}

export const List = ({ tasks, view, focusCount, onCaptureFocus, ...handlers }) => {
  const [title, subtitle] = copy[view] ?? copy.today

  return (
    <section className={s.listSection} aria-labelledby="task-list-title">
      <div className={s.listHeading}>
        <div>
          <span className={s.eyebrow}>List</span>
          <h2 id="task-list-title">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span className={s.resultCount}>{tasks.length} shown</span>
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
          <h3>No tasks here.</h3>
          <p>Add a task or switch to another view.</p>
          <button type="button" className={s.ghostButton} onClick={onCaptureFocus}>
            Add a task <FiArrowUpRight aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}

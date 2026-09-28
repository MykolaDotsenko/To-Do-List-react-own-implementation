import { FiArrowUpRight, FiCheckCircle } from 'react-icons/fi'
import { TodoCard } from './TodoCard'
import s from './TodoList.module.scss'

const copy = {
  today: ['Today', 'What is already on the table.'],
  focus: ['Pinned', 'The three things you chose to keep in sight.'],
  all: ['Everything', 'The full drawer, when you need it.'],
  completed: ['Done', 'Things you can stop carrying around.'],
}

export const List = ({ tasks, view, focusCount, onCaptureFocus, ...handlers }) => {
  const [title, subtitle] = copy[view] ?? copy.today

  return (
    <section className={s.listSection} aria-labelledby="task-list-title">
      <div className={s.listHeading}>
        <div>
          <span className={s.eyebrow}>Notebook</span>
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
          <h3>Nothing on this page.</h3>
          <p>Jot something down, or turn to another page.</p>
          <button type="button" className={s.ghostButton} onClick={onCaptureFocus}>
            Add a task <FiArrowUpRight aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  )
}

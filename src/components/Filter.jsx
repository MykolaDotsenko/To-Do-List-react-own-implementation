import { FiCheckCircle, FiCircle, FiGrid, FiSearch, FiStar } from 'react-icons/fi'
import s from './TodoList.module.scss'

const views = [
  { id: 'today', label: 'Today', icon: FiCircle },
  { id: 'focus', label: 'Top 3', icon: FiStar },
  { id: 'all', label: 'All', icon: FiGrid },
  { id: 'completed', label: 'Done', icon: FiCheckCircle },
]

export const Filter = ({ view, onViewChange, query, onQueryChange, counts, searchRef }) => (
  <>
    <nav className={s.sidebarNav} aria-label="Task views">
      <div className={s.navLabel}>Workspace</div>
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className={view === id ? `${s.navButton} ${s.navButtonActive}` : s.navButton}
          onClick={() => onViewChange(id)}
          aria-current={view === id ? 'page' : undefined}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
          <span className={s.navCount}>{counts[id]}</span>
        </button>
      ))}
    </nav>

    <label className={s.searchBox}>
      <FiSearch aria-hidden="true" />
      <span className={s.srOnly}>Search tasks</span>
      <input
        ref={searchRef}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search"
        type="search"
      />
      <kbd>/</kbd>
    </label>
  </>
)

import { TodoCard } from './TodoCard'
import s from './TodoList.module.scss'
export const List = ({ todos, handleDeleteItem, handleToggleTodo, handleSwitchFav, handleUpdateText }) => {
	return (
		<ul className={s.wrapper}>
			{todos.map(item => (
				<TodoCard
					key={item.id}
					item={item}
					handleUpdateText={handleUpdateText}
					handleToggleTodo={handleToggleTodo}
					handleSwitchFav={handleSwitchFav}
					handleDeleteItem={handleDeleteItem}
				/>
			))}
		</ul>
	)
} 
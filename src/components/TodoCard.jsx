import s from './TodoList.module.scss'
import { FcLike, FcLikePlaceholder } from 'react-icons/fc'

export const TodoCard = ({ item, handleDeleteItem, handleToggleTodo, handleSwitchFav, handleUpdateText }) => {
	return (
		<li className={s.todo}>
			<input onChange={() => handleToggleTodo(item.id)} type='checkbox' checked={item.completed} />
			<p>{item.title}</p>
			<div>
				<button className={s.btn} onClick={() => handleSwitchFav(item.id)}>
					{item.favorite ? <FcLike /> : <FcLikePlaceholder />}
				</button>
				<button onClick={() => handleUpdateText(item.id)} className={s.btn}>
					Update
				</button>
				<button className={s.btn} onClick={() => handleDeleteItem(item.id)}>
					Delete
				</button>
			</div>
		</li>
	)
}
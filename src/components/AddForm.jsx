import { useState } from 'react'
import s from './TodoList.module.scss'

export const AddForm = ({ handleAddTodo }) => {
	const [newTodoTitle, setNewTodoTitle] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		handleAddTodo(newTodoTitle)
		setNewTodoTitle('')
	}
	return (
		<form className={s.form} onSubmit={handleSubmit}>
			<input className={s.input} value={newTodoTitle} onChange={e => setNewTodoTitle(e.target.value)} type='text' />
			<button className={s.btn}>Add todo</button>
		</form>
	)
}
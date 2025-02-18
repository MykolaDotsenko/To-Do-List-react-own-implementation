import { nanoid } from 'nanoid'
import { useState, useEffect } from 'react'
import { AddForm } from './AddForm'
import { List } from './List'
import { Filter } from './Filter'

export const Todolist = () => {
	const [todos, setTodos] = useState([])
	const [activeFilter, setActiveFilter] = useState('all')

	// Load todos from local storage when the component mounts
	useEffect(() => {
		const storedTodos = JSON.parse(localStorage.getItem('todos'))
		if (storedTodos) {
			setTodos(storedTodos)
		}
	}, [])

	// Save todos to local storage whenever they change
	useEffect(() => {
		localStorage.setItem('todos', JSON.stringify(todos))
	}, [todos])

	const getFilteredData = () => {
		switch (activeFilter) {
			case 'active':
				return todos.filter(item => !item.completed) //-> [...]
			case 'completed':
				return todos.filter(item => item.completed) //-> [...]
			case 'favorite':
				return todos.filter(item => item.favorite) //-> [...]
			default:
				return todos
		}
	}

	const handleDeleteItem = id => {
		console.log(id)
		setTodos(prev => prev.filter(item => item.id !== id))
	}

	const handleAddTodo = title => {
		const newTodo = { id: nanoid(), title, completed: false, favorite: false }
		setTodos(prev => [...prev, newTodo])
	}

	const handleToggleTodo = id => {
		setTodos(prev => prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item)))
	}

	const handleSwitchFav = id => {
		setTodos(prev => prev.map(item => (item.id === id ? { ...item, favorite: !item.favorite } : item)))
	}

	const handleUpdateText = id => {
		setTodos(prev => prev.map(item => (item.id === id ? { ...item, title: 'Cancel' } : item)))
	}

	const filteredData = getFilteredData()

	return (
		<div>
			<AddForm handleAddTodo={handleAddTodo} />
			<Filter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
			<List
				todos={filteredData}
				handleDeleteItem={handleDeleteItem}
				handleToggleTodo={handleToggleTodo}
				handleSwitchFav={handleSwitchFav}
				handleUpdateText={handleUpdateText}
			/>
		</div>
	)
}

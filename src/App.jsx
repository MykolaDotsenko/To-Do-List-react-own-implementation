import { useState } from "react"
import { nanoid } from "nanoid"

function App () {
  const [todos, setTodos] = useState([
  ])
  const [newTodoTitle, setNewTodoTitle] = useState('')


  const handleToggleTodo = id => {
setTodos(prev => prev.map(item => (item.id === id ? {...item, completed:!item.completed} : item)))
  }

const handleDeleteItem = id => {
  console.log(id);
  const newTodos = todos.filter(item =>item.id !== id )
  setTodos(newTodos)
}

const handleAddTodo = () => {
  const newTodo = {id: nanoid(), title:'TEST TITLE', completed:false}
  setTodos(prev => [...prev, newTodo])
}
const handleSubmit = (e) => {
e.preventDefault()
console.log('Form was submitted');
const newTodo = {id: nanoid(), title:newTodoTitle, completed:false}
setTodos(prev => [...prev, newTodo])
setNewTodoTitle('')
}

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} type = 'text' />
        <button>Add todo</button>
      </form>
      <button onClick={handleAddTodo}>Add</button>
      <ul>
        {todos.map(item => (
        <li key={item.id}>
          <input onChange={()=>handleToggleTodo(item.id)}type='checkbox' checked={item.completed}/>
          <p>{item.title}</p>
          <button onClick={() =>handleDeleteItem(item.id)}>Delete</button>
        </li>
        ))}
      </ul>
    </div>
  )
}


export default App
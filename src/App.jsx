import { useState } from "react"

function App () {
  const [todos, setTodos] = useState([
    {id:'1', title: 'React', completed:false},
    {id:'2', title: 'JS', completed:false},
    {id:'3', title: 'CSS', completed:false}
  ])

const handleDeleteItem = id => {
  console.log(id);
  const newTodos = todos.filter(item =>item.id !== id )
  setTodos(newTodos)
}

const handleAddTodo = () => {
  const newTodo = {id:5, title:'TEST TITLE', completed:false}
  setTodos(prev => [...prev, newTodo])
}

  return (
    <div>
      <form>
        <input type = 'text' />
        <button onClick={handleAddTodo}>Add todo</button>
      </form>
      <ul>
        {todos.map(item => (
        <li key={item.id}>
          <input type='checkbox'/>
          <p>{item.title}</p>
          <button onClick={() =>handleDeleteItem(item.id)}>Delete</button>
        </li>
        ))}
      </ul>
    </div>
  )
}


export default App
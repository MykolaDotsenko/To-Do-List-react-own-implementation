import { useState } from "react";
import { nanoid } from "nanoid";
import { AddForm } from "./components/AddForm";

function App() {
  const [todos, setTodos] = useState([]);

  const handleToggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    setTodos(newTodos);
  };

  const handleAddTodo = (title) => {
    const newTodo = { id: nanoid(), title, completed: false };
    setTodos((prev) => [...prev, newTodo]);
  };

  return (
    <div>
      <AddForm handleAddTodo={handleAddTodo} />
      <ul>
        {todos.map((item) => (
          <li key={item.id}>
            <input
              onChange={() => handleToggleTodo(item.id)}
              type="checkbox"
              checked={item.completed}
            />
            <p>{item.title}</p>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

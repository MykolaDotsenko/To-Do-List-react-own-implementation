import React, { useState } from "react";

export const AddForm = ({ handleAddTodo }) => {
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTodo(newTodoTitle);
    console.log(newTodoTitle);
    setNewTodoTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        type="text"
      />
      <button>Add todo</button>
    </form>
  );
};

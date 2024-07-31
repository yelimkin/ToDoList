import { useState } from 'react';
import { useTodos } from '../context/TodoContext';

const AddTodo = () => {
  const [text, setText] = useState('');
  const { addTodo } = useTodos();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({ text, completed: false });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow p-2 border"
        placeholder="Enter a todo"
      />
      <button type="submit" className="p-2 bg-blue-500 text-white">Add</button>
    </form>
  );
};

export default AddTodo;

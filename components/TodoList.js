import { useEffect } from 'react';
import { useTodos } from '../context/TodoContext';

const TodoList = () => {
  const { todos, fetchTodos, updateTodo, deleteTodo } = useTodos();

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleComplete = (id) => {
    updateTodo(id, { completed: true });
  };

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id} className="flex justify-between items-center p-2 border-b">
          <span>{todo.text}</span>
          <div>
            <button onClick={() => handleComplete(todo.id)}>Complete</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;

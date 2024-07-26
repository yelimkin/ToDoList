import React from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const handleToggle = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    // 페이지 새로 고침 또는 상태 업데이트
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    // 페이지 새로 고침 또는 상태 업데이트
  };

  return (
    <ul className="list-disc pl-5">
      {todos.map(todo => (
        <li key={todo.id} className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => handleToggle(todo.id, todo.completed)}
            className="form-checkbox"
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.text}
          </span>
          <button
            onClick={() => handleDelete(todo.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;

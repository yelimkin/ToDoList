import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [session] = useSession();

  useEffect(() => {
    if (session) {
      fetch('/api/todos')
        .then((res) => res.json())
        .then((data) => setTodos(data));
    }
  }, [session]);

  const addTodo = async (text) => {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((todo) => todo._id === id);
    const res = await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, completed: !todo.completed }),
    });
    if (res.ok) {
      setTodos(todos.map((todo) => (todo._id === id ? { ...todo, completed: !todo.completed } : todo)));
    }
  };

  const deleteTodo = async (id) => {
    const res = await fetch('/api/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setTodos(todos.filter((todo) => todo._id !== id));
    }
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => useContext(TodoContext);

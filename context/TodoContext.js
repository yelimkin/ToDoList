import { createContext, useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const { data: session } = useSession();
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    if (session) {
      const res = await axios.get(`/api/todos/${session.user.id}`);
      setTodos(res.data);
    }
  };

  const addTodo = async (todo) => {
    await axios.post(`/api/todos/${session.user.id}`, todo);
    fetchTodos();
  };

  const updateTodo = async (id, updateData) => {
    await axios.put(`/api/todos/${session.user.id}`, { id, ...updateData });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`/api/todos/${session.user.id}`, { data: { id } });
    fetchTodos();
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, updateTodo, deleteTodo, fetchTodos }}>
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => useContext(TodoContext);

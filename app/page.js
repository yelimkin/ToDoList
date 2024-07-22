"use client";

import { useState, useEffect } from 'react';
// import { db } from '../utils/firebase';
// import { collection, getDocs, addDoc } from 'firebase/firestore';
import TodoItem from './components/TodoItem';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) {
      alert('Todo text cannot be empty');
      return;
    }
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      setNewTodo('');
      const newTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, { text: newTodo, completed: false }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>ToDo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <div>
        {todos.map((todo, index) => (
          <TodoItem key={index} todo={todo} />
        ))}
      </div>
    </div>
  );
}

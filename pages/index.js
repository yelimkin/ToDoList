import { useTodos } from '../components/TodoContext';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function Home() {
  const [session] = useSession();
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
  const [text, setText] = useState('');
  const router = useRouter();

  const handleAddTodo = (e) => {
    e.preventDefault();
    addTodo(text);
    setText('');
  };

  if (!session) {
    return (
      <div>
        <h1>Please log in</h1>
        <button onClick={() => signIn()}>Log in</button>
        <button onClick={() => router.push('/register')}>Sign Up</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => signOut()}>Log out</button>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo._id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

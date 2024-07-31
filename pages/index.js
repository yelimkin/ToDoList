import { useSession, signIn, signOut } from 'next-auth/react';
import TodoList from '../components/TodoList';
import AddTodo from '../components/AddTodo';
import { TodoProvider } from '../context/TodoContext';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <TodoProvider>
      <div>
        <button onClick={() => signOut()}>Sign out</button>
        <AddTodo />
        <TodoList />
      </div>
    </TodoProvider>
  );
}

import { getTodos } from '../lib/firebase'; // Firebase 데이터 패칭 함수
import TodoList from '../app/components/TodoList';
import TodoForm from '../app/components/TodoForm';

export default async function Page() {
  const todos = await getTodos();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Todo List</h1>
      <TodoForm />
      <TodoList todos={todos} />
    </div>
  );
}

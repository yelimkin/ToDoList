import { renderHook, act } from '@testing-library/react-hooks';
import { TodoProvider, useTodos } from '../components/TodoContext';

test('adds a todo', async () => {
  const { result } = renderHook(() => useTodos(), { wrapper: TodoProvider });

  await act(async () => {
    await result.current.addTodo('New Todo');
  });

  expect(result.current.todos).toHaveLength(1);
  expect(result.current.todos[0].text).toBe('New Todo');
});

import { render, screen } from '@testing-library/react';
import TodoList from '../components/TodoList';
import { TodoProvider } from '../context/TodoContext';

test('renders TodoList component', () => {
  render(
    <TodoProvider>
      <TodoList />
    </TodoProvider>
  );
  expect(screen.getByText(/complete/i)).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

test('renders a heading', () => {
  render(<Home />);
  const heading = screen.getByRole('heading', { name: /Todo List/i });
  expect(heading).toBeInTheDocument();
});

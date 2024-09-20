import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../pages/register';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
useRouter.mockReturnValue({ push: mockPush });

test('renders registration form and submits data', async () => {
  render(<Register />);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const registerButton = screen.getByText(/Register/i);

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(registerButton);

  expect(await screen.findByText(/TodoList/i)).toBeInTheDocument();
});

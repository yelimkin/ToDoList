import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/login'; // 경로를 컴포넌트 경로로 맞춤
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

test('renders login form and submits data', async () => {
  render(<Login />);

  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginButton = screen.getByText(/Log in/i);

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(loginButton);

  expect(signIn).toHaveBeenCalledWith('credentials', {
    redirect: false,
    email: 'test@example.com',
    password: 'password123',
  });
});

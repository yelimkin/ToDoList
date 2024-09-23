import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/login'; // 경로를 컴포넌트 경로로 맞춤
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

test('renders login form and submits data', async () => {
  render(<Login />); // 컴포넌트 렌더링

  // DOM 요소 선택 : 사용자 입력 필드와 로그인 버튼을 선택
  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const loginButton = screen.getByText(/Log in/i);

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(loginButton); // 로그인 버튼 클릭 시뮬레이션

  // 함수 호출 여부 검증 : 모의된 signIn 함수가 올바른 인자로 호출되었는지 
  expect(signIn).toHaveBeenCalledWith('credentials', {
    redirect: false,
    email: 'test@example.com',
    password: 'password123',
  });
});

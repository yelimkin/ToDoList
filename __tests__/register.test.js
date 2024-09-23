import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../pages/register';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
useRouter.mockReturnValue({ push: mockPush });

test('renders registration form and submits data', async () => {
  render(<Register />); // 컴포넌트 렌더링

  // DOM 요소 선택 : 사용자 입력 필드와 회원가입 버튼을 선택
  const emailInput = screen.getByPlaceholderText(/Email/i);
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  const registerButton = screen.getByText(/Register/i);

  // 사용자 입력 시뮬레이션 : 이메일과 비밀번호 입력 필드에 값을 입력하는 동작을 시뮬레이션
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  // 폼 제출 시뮬레이션 : 회원가입 버튼을 클릭하여 폼 제출 동작을 시뮬레이션
  fireEvent.click(registerButton);

  // 라우터 동작 검증 : useRouter의 push 메서드를 모의하여, 폼 제출 후에 특정 경로로 이동하는지 확인
  // 폼 제출 후에 TodoList라는 텍스트가 화면에 표시되는지를 비동기로 확인
  expect(await screen.findByText(/TodoList/i)).toBeInTheDocument();
});

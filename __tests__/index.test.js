import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/index'; // index.js 페이지 컴포넌트
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTodos } from '../components/TodoContext';

jest.mock('next-auth/react'); // next-auth 관련 함수 모킹
jest.mock('../components/TodoContext'); // TodoContext 모킹

const mockTodos = [{ _id: '1', text: 'Test Todo', completed: false }];

useTodos.mockReturnValue({
  todos: mockTodos,
  addTodo: jest.fn(),
  toggleTodo: jest.fn(),
  deleteTodo: jest.fn(),
});

describe('Home page', () => { // 로그인 상태에 따른 UI 렌더링 검증 : 인증되지 않은 상태에서 로그인 버튼이 표시되는지 확인
  test('renders login button when not authenticated', () => {
    useSession.mockReturnValueOnce({ data: null, status: 'unauthenticated' });

    render(<Home />);

    const loginButton = screen.getByText(/Log In/i);
    expect(loginButton).toBeInTheDocument();
  });

  test('renders todos when authenticated', () => { // 인증된 상태에서 투두 리스트 렌더링 검증 : 인증된 사용자에게 투두 아이템이 올바르게 표시되는지 확인
    useSession.mockReturnValueOnce({ data: { user: { name: 'Test User' } }, status: 'authenticated' });

    render(<Home />);

    const todoText = screen.getByText('Test Todo');
    expect(todoText).toBeInTheDocument();
  });

  test('calls addTodo when form is submitted', () => { // 폼 제출 시 동작 검증 : 새로운 투두 아이템을 추가할 때 addTodo 함수가 올바르게 호출되는지 확인
    useSession.mockReturnValueOnce({ data: { user: { name: 'Test User' } }, status: 'authenticated' });

    const mockAddTodo = jest.fn();
    useTodos.mockReturnValue({
      todos: mockTodos,
      addTodo: mockAddTodo,
      toggleTodo: jest.fn(),
      deleteTodo: jest.fn(),
    });

    render(<Home />);

    const input = screen.getByPlaceholderText(/Enter what to do/i);
    fireEvent.change(input, { target: { value: 'New Todo' } });

    const submitButton = screen.getByText(/Add Todo/i);
    fireEvent.click(submitButton);

    expect(mockAddTodo).toHaveBeenCalledWith('New Todo');
  });
});

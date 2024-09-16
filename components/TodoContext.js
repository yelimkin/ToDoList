import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const TodoContext = createContext(); // 애플리케이션의 전역 상태를 관리하는 Context 객체 (TodoList와 관련된 데이터를 관리)

export function TodoProvider({ children }) { // 애플리케이션 내에서 전역적으로 사용할 수 있는 TodoList 상태와 함수들을 제공
  const [todos, setTodos] = useState([]); // 현재 사용자의 할 일 목록을 관리하는 상태
  const { data: session } = useSession(); // 현재 사용자의 세션 정보 (사용자가 로그인된 상태인지 확인)

  useEffect(() => {
    let isMounted = true;

    const fetchTodos = async () => {
      if (session) {
        try {
          const res = await fetch('/api/todos', {
            credentials: 'include',
          });
          if (!res.ok) {
            throw new Error('할 일 목록을 가져오는데 실패했습니다.');
          }
          const data = await res.json();
          if (isMounted) {
            setTodos(data);
          }
        } catch (error) {
          console.error('할 일 목록을 가져오는 중 에러 발생:', error);
        }
      } else {
        // 세션이 없으면 할 일 목록을 비웁니다.
        setTodos([]);
      }
    };

    fetchTodos();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const addTodo = async (text) => { // 할 일(text) 추가 함수
    try {
      const res = await fetch('/api/todos', { // '/api/todos' 엔드포인트로 POST 요청을 보내 새 할 일을 추가
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error('할 일을 추가하는데 실패했습니다.');
      }

      const newTodo = await res.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]); // 새로운 할 일을 기존 todos 배열에 추가하여 상태를 업데이트
    } catch(error) {
      console.error('할 일 추가 중 에러 발생:', error);
    }
  };

  const toggleTodo = async (id) => { // 특정 할 일의 완료 상태 변경 함수
    const todo = todos.find((todo) => todo._id === id); // 특정 할 일 찾기
    if (!todo) return;

    try {
      const res = await fetch('/api/todos', { // '/api/todos' 엔드포인트로 PUT 요청
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id, completed: !todo.completed }), // 해당 할 일의 completed 상태를 반전
      });

      if (!res.ok) {
        throw new Error('할 일 상태를 변경하는데 실패했습니다.');
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch(error) {
      console.error('할 일 상태 변경 중 에러 발생:', error);
    }
    
  };

  const deleteTodo = async (id) => { // 특정 할 일 삭제 함수
    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 세션 쿠키 포함
        body: JSON.stringify({ id }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '삭제 요청 실패');
      }
  
      // 서버로부터 성공적인 응답을 받았을 때 상태 업데이트
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('할 일 삭제 중 에러 발생:', error);
      // 필요에 따라 사용자에게 에러 메시지를 표시합니다.
    }
  };

  // TodoContext.Provider : todos 상태와 관련된 함수들(addTodo, toggleTodo, deleteTodo)을 애플리케이션 내에서 사용할 수 있도록 제공
  // -> {children} : TodoProvider로 감싸진 모든 자식 컴포넌트들은 이 전역 상태와 함수들에 접근
  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
      {children} 
    </TodoContext.Provider>
  );
}

// useTodos : useContext 훅을 사용하여 TodoContext에 쉽게 접근할 수 있는 커스텀 훅 -> 컴포넌트에서 TodoList 상태와 관련된 함수들을 쉽게 사용
export const useTodos = () => useContext(TodoContext);

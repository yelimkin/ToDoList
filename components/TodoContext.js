import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const TodoContext = createContext(); // 애플리케이션의 전역 상태를 관리하는 Context 객체 (TodoList와 관련된 데이터를 관리)

export function TodoProvider({ children }) { // 애플리케이션 내에서 전역적으로 사용할 수 있는 TodoList 상태와 함수들을 제공
  const [todos, setTodos] = useState([]); // 현재 사용자의 할 일 목록을 관리하는 상태
  const { data: session } = useSession(); // 현재 사용자의 세션 정보 (사용자가 로그인된 상태인지 확인)

  useEffect(() => {
    if (session) { // 사용자가 로그인된 상태라면
      fetch('/api/todos') // 서버에서 현재 사용자의 할 일 목록을 가져오기 위해 GET 요청 보내기
        .then((res) => res.json()) // 서버로부터 받은 응답을 JSON 형태로 변환
        .then((data) => setTodos(data)); // 서버로부터 받은 할 일 목록 데이터를 todos 상태에 저장
    }
  }, [session]);

  const addTodo = async (text) => { // 할 일(text) 추가 함수
    const res = await fetch('/api/todos', { // '/api/todos' 엔드포인트로 POST 요청을 보내 새 할 일을 추가
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]); // 새로운 할 일을 기존 todos 배열에 추가하여 상태를 업데이트
  };

  const toggleTodo = async (id) => { // 특정 할 일의 완료 상태 변경 함수
    const todo = todos.find((todo) => todo._id === id); // 특정 할 일 찾기
    const res = await fetch('/api/todos', { // '/api/todos' 엔드포인트로 PUT 요청
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, completed: !todo.completed }), // 해당 할 일의 completed 상태를 반전
    });
    if (res.ok) { // 상태가 성공적으로 업데이트되면 todos 배열을 업데이트
      setTodos(todos.map((todo) => (todo._id === id ? { ...todo, completed: !todo.completed } : todo)));
    }
  };

  const deleteTodo = async (id) => { // 특정 할 일 삭제 함수
    const res = await fetch('/api/todos', { // '/api/todos' 엔드포인트로 DELETE 요청을 보내 특정 할 일을 삭제
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // 삭제할 특정 할 일
    });
    if (res.ok) { // 삭제가 성공적으로 이루어지면 todos 배열에서 해당 할 일을 제거하고 상태를 업데이트
      setTodos(todos.filter((todo) => todo._id !== id)); 
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

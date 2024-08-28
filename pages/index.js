import { useTodos } from '../components/TodoContext';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/client'; // { 사용자 세션 정보 가져오기, 사용자 로그인, 사용자 로그아웃 }
import { useRouter } from 'next/router'; // 클라이언트 측에서 페이지 이동을 제어 -> 회원가입 페이지로 이동하는 데 사용

export default function Home() {
  const [session] = useSession(); // 사용자가 로그인되어 있는지 여부에 따라 다른 내용을 표시
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(); // 가져온 할 일 목록과 관련된 상태와 함수들
  const [text, setText] = useState('');
  const router = useRouter();

  const handleAddTodo = (e) => { // 할 일 추가 핸들러 : 사용자가 새 할 일을 입력한 후 폼을 제출할 때 호출
    e.preventDefault(); // 기본 폼 제출 동작을 막아 페이지가 새로고침되지 않게 하기
    addTodo(text);
    setText('');
  };

  if (!session) { // 사용자가 로그인되어 있지 않다면, 로그인과 회원가입 화면으로 구성
    return ( 
      <div>
        <h1>Please log in</h1>
        <button onClick={() => signIn()}>Log in</button> {/* NextAuth.js의 signIn 함수를 호출하여 로그인 페이지로 이동 */}
        <button onClick={() => router.push('/register')}>Sign Up</button> {/* '/register' 경로로 이동하여 회원가입 페이지로 이동 */}
      </div>
    );
  }

  // 로그인한 상태라면,
  return (
    <div>
      <h1>Todo List</h1>
      <button onClick={() => signOut()}>Log out</button> {/* NextAuth.js의 signOut 함수를 호출하여 사용자를 로그아웃 */}
      <form onSubmit={handleAddTodo}> {/* 사용자가 새 할 일을 입력할 수 있는 폼 */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>
      <ul> {/* 할 일 목록 */}
        {todos.map((todo) => ( // todos 배열을 반복하여 각 할 일을 리스트 항목으로 렌더링
          <li key={todo._id}>
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo._id)}
            > {/* 할 일 텍스트를 클릭하면, 완료 여부를 변경하는 함수가 호출 */}
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button> {/* 할 일이 완료된 경우, 텍스트에 line-through 스타일을 적용하여 완료 상태 표시 */}
          </li>
        ))}
      </ul>
    </div>
  );
}

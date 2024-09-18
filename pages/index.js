import { useTodos } from '../components/TodoContext';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react'; // { 사용자 세션 정보 가져오기, 사용자 로그인, 사용자 로그아웃 }
import { useRouter } from 'next/router'; // 클라이언트 측에서 페이지 이동을 제어 -> 회원가입 페이지로 이동하는 데 사용

export default function Home() {
  const { data: session, status } = useSession(); // 사용자가 로그인되어 있는지 여부에 따라 다른 내용을 표시
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(); // 가져온 할 일 목록과 관련된 상태와 함수들
  const [text, setText] = useState('');
  const router = useRouter();

  const handleAddTodo = (e) => { // 할 일 추가 핸들러 : 사용자가 새 할 일을 입력한 후 폼을 제출할 때 호출
    e.preventDefault(); // 기본 폼 제출 동작을 막아 페이지가 새로고침되지 않게 하기
    addTodo(text);
    setText('');
  };

  useEffect(() => {
    console.log({session});
    console.log({status});
  }, [session, status]);

  // 세션이 로딩 중일 때 로딩 화면 표시
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (!session) { // 사용자가 로그인되어 있지 않다면, 로그인과 회원가입 화면으로 구성
    return ( 
      <div className="grid min-h-screen place-items-center">
        <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
          <h1 className="text-5xl font-semibold">TodoList, <span className="font-normal">please log in.</span></h1>
          <div className="mt-6">
            <button onClick={() => signIn()} className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none">
              Log In
            </button> {/* NextAuth.js의 signIn 함수를 호출하여 로그인 페이지로 이동 */}
            <button onClick={() => router.push('/register')} className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none">
              Sign Up
            </button> {/* '/register' 경로로 이동하여 회원가입 페이지로 이동 */}
          </div>
        </div>
      </div>
    );
  }

  // 로그인한 상태라면,
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
        <h1 className="text-3xl font-semibold text-center">To-do List</h1>
        <button onClick={() => signOut()} className="inline-block mt-4 text-xs text-gray-500 cursor-pointer hover:text-black">
          Log out
        </button> {/* NextAuth.js의 signOut 함수를 호출하여 사용자를 로그아웃 */}
        <form onSubmit={handleAddTodo} className="mt-6"> {/* 사용자가 새 할 일을 입력할 수 있는 폼 */}
          <div className="flex gap-3">
            <input 
              id="todo" 
              type="text" 
              name="todo" 
              placeholder="Enter what to do." 
              autoComplete="off" 
              className="w-full p-3 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              required 
            />
            <button type="submit" className="py-3 px-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none">
              Add Todo
            </button>
          </div>
        </form>
        <ul className="mt-6">
          {todos.map((todo) => ( // todos 배열을 반복하여 각 할 일을 리스트 항목으로 렌더링
            <li className="flex justify-between items-center mt-4 p-2 bg-gray-100" key={todo._id}>
              <span
                className="text-gray-700 cursor-pointer hover:text-black"
                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                onClick={() => toggleTodo(todo._id)}
              > {/* 할 일 텍스트를 클릭하면, 완료 여부를 변경하는 함수가 호출 */}
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo._id)} className="py-1 px-3 font-medium tracking-widest text-white uppercase bg-red-500 shadow-lg focus:outline-none hover:bg-red-700 hover:shadow-none">
                Delete
              </button> {/* 할 일이 완료된 경우, 텍스트에 line-through 스타일을 적용하여 완료 상태 표시 */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { signIn } from 'next-auth/client';

export default function Login() { // 직접 '/login'으로 접근하는 로그인 페이지
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn()}>Log in</button>
    </div>
  );
}

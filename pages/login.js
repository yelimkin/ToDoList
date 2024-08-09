import { signIn } from 'next-auth/client';

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn()}>Log in</button>
    </div>
  );
}

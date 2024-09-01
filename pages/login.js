import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Login() { // 직접 '/login'으로 접근하는 로그인 페이지
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await signIn('credentials', {
      redirect: false, // 리다이렉트 없이 현재 페이지에서 처리 
      email,
      password,
    });
    console.log({res});
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Log in</button>
      </form>
      {/* <button onClick={() => signIn()}>Log in</button> */}
    </div>
  );
}

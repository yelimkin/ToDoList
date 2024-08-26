import { useState } from 'react'; // React의 상태 관리 훅, 상태 변수 관리
import { useRouter } from 'next/router'; // Next.js의 라우팅 훅, 클라이언트 측 페이지 전환을 처리 -> 회원가입이 성공적으로 완료되면 로그인 페이지로 리디렉션

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => { // 사용자가 폼을 제출할 때 호출되는 함수
    e.preventDefault(); // 폼 제출을 중단

    const res = await fetch('/api/register', { // 사용자가 입력한 이메일과 비밀번호를 서버의 회원가입 API '/api/register'로 전송
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json(); // 서버에서 응답을 받고, 그 응답을 JSON 형식으로 파싱하여 저장

    if (res.status === 201) {
      router.push('/login'); // 로그인 페이지로 리디렉션
    } else {
      setError(data.message);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

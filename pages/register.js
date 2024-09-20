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
    <div className="grid min-h-screen place-items-center">
      <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
        <h1 className="text-xl font-semibold">TodoList, <br></br> <span className="font-normal">please fill in your information to continue.</span></h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="email" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">E-mail</label>
          <input 
            id="email" 
            type="email" 
            name="email" 
            placeholder="Email" 
            autoComplete="email" 
            className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <label htmlFor="password" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Password</label>
          <input 
            id="password" 
            type="password" 
            name="password" 
            placeholder="Password" 
            autoComplete="new-password" 
            className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          <button type="submit" className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none">
            Register
          </button>
          <p className="flex justify-between inline-block mt-4 text-xs text-red-500 cursor-pointer hover:text-black">{error}</p>
        </form>
      </div>
    </div>
  );
}

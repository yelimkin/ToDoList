import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() { // 직접 '/login'으로 접근하는 로그인 페이지
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await signIn('credentials', {
      redirect: false, // 리다이렉트 없이 현재 페이지에서 처리 
      email,
      password,
    });
    console.log({res});

    // 로그인 성공 시 res.ok가 true로 설정
    if (res.ok) {
      router.push('/');  // 홈 화면으로 리다이렉트
    } else {
      console.log('Login failed:', res.error);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="w-11/12 p-12 bg-white sm:w-8/12 md:w-1/2 lg:w-5/12">
        <h1 className="text-xl font-semibold">Hello there?, <span className="font-normal">please fill in your information to log in.</span></h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <label htmlFor="email" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">E-mail</label>
          <input 
            id="email" 
            type="email" 
            name="email" 
            autoComplete="email" 
            className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" required 
          />
          <label htmlFor="password" className="block mt-2 text-xs font-semibold text-gray-600 uppercase">Password</label>
          <input 
            id="password" 
            type="password" 
            name="password" 
            autoComplete="new-password" 
            className="block w-full p-3 mt-2 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required 
          />
          <button type="submit" className="w-full py-3 mt-6 font-medium tracking-widest text-white uppercase bg-black shadow-lg focus:outline-none hover:bg-gray-900 hover:shadow-none">
            Log in
          </button>
          {/* <p class="flex justify-between inline-block mt-4 text-xs text-gray-500 cursor-pointer hover:text-black">Register</p> */}
        </form>
      </div>
    </div>
  );
}

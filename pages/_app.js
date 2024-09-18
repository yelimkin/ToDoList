import { SessionProvider } from 'next-auth/react'; // 애플리케이션에서 인증과 관련된 상태를 전역적으로 관리

import { TodoProvider } from '../components/TodoContext'; // TodoList와 관련된 상태를 관리
import '../styles/globals.css';
import Layout from '../components/Layout';

function App({ Component, session, ...pageProps }) { // 모든 페이지의 공통 레이아웃을 정의 ({ 현재 렌더링할 페이지 컴포넌트, 해당 페이지 컴포넌트에 전달할 초기 props }) 
  return (
    <SessionProvider session={session}> {/* 세션 상태를 제공하는 컴포넌트로 모든 페이지에서 로그인 상태와 세션 정보를 쉽게 사용, 서버 측에서 세션 정보를 받아와 클라이언트에 전달하는 seesion 속성 사용 */}
      <TodoProvider> {/* TodoList와 관련된 상태를 제공하는 컨텍스트 공급자로 모든 페이지에서 할 일 목록과 관련된 상태를 쉽게 관리 */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TodoProvider>
    </SessionProvider>
  );
  // -> AuthProvider에서 인증 상태 전역 관리
  // -> TodoProvider에서 TodoList 상태 전역 관리
}

export default App;

import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { TodoProvider } from '../context/TodoContext';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <TodoProvider>
        <Component {...pageProps} />
      </TodoProvider>
    </SessionProvider>
  );
}

export default MyApp;

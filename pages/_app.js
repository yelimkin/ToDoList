import { Provider as AuthProvider } from 'next-auth/client';
import { TodoProvider } from '../components/TodoContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <TodoProvider>
        <Component {...pageProps} />
      </TodoProvider>
    </AuthProvider>
  );
}

export default MyApp;
